import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useLocale } from '../context/LocaleContext'
import { mediaUrl } from '../utils/mediaUrl'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

let renderQueue = Promise.resolve()

function enqueueRender(task) {
  renderQueue = renderQueue.then(task).catch(() => {})
  return renderQueue
}

async function renderPageFull(pdfPage, canvas, containerWidth) {
  const baseViewport = pdfPage.getViewport({ scale: 1 })
  const width = Math.max(280, containerWidth)
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const scale = (width * dpr) / baseViewport.width
  const viewport = pdfPage.getViewport({ scale })
  const ctx = canvas.getContext('2d')
  canvas.width = viewport.width
  canvas.height = viewport.height
  canvas.style.width = '100%'
  canvas.style.height = 'auto'
  canvas.style.display = 'block'
  await pdfPage.render({ canvasContext: ctx, viewport }).promise
}

const VARIANT_CLASSES = {
  catalog: {
    page: 'catalog-scroll-page',
    canvas: 'catalog-scroll-canvas',
    loading: 'catalog-scroll-loading',
  },
  paper: {
    page: 'legal-pdf-page',
    canvas: 'legal-pdf-canvas',
    loading: 'legal-pdf-loading',
  },
}

function CatalogPage({ pdfDoc, pageNum, variant = 'catalog' }) {
  const classes = VARIANT_CLASSES[variant] || VARIANT_CLASSES.catalog
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  // First pages must render without waiting for IO — zero-height placeholders never intersect.
  const visible = useVisible(wrapRef, pageNum <= 2)
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 390))

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const measure = () => setWidth(el.offsetWidth || window.innerWidth)
    measure()
    if (typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!pdfDoc || !visible || !canvasRef.current || width < 1) return undefined
    let cancelled = false
    setReady(false)

    pdfDoc.getPage(pageNum)
      .then((pdfPage) => {
        if (cancelled || !canvasRef.current) return
        return enqueueRender(async () => {
          if (cancelled || !canvasRef.current) return
          await renderPageFull(pdfPage, canvasRef.current, width)
          if (!cancelled) setReady(true)
        })
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [pdfDoc, pageNum, visible, width])

  return (
    <div ref={wrapRef} className={classes.page} data-page={pageNum}>
      {!ready && <div className={classes.loading}>{pageNum}</div>}
      <canvas ref={canvasRef} className={`${classes.canvas}${ready ? ' ready' : ''}`} />
    </div>
  )
}

function useVisible(ref, initial = false) {
  const [visible, setVisible] = useState(initial)
  useEffect(() => {
    if (initial) return undefined
    const el = ref.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { rootMargin: '400px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, initial])
  return visible
}

export default function CatalogBrochureViewer({ url, title, onError, variant = 'catalog' }) {
  const { t } = useLocale()
  const scrollClass = variant === 'paper' ? 'legal-pdf-scroll' : 'catalog-scroll'
  const loadingMainClass = variant === 'paper' ? 'legal-pdf-loading legal-pdf-loading--main' : 'catalog-scroll-loading catalog-scroll-loading--main'
  const [pdfDoc, setPdfDoc] = useState(null)
  const [numPages, setNumPages] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setError('')
    setPdfDoc(null)
    setNumPages(0)

    pdfjsLib.getDocument(mediaUrl(url)).promise
      .then((doc) => {
        if (cancelled) return
        setPdfDoc(doc)
        setNumPages(doc.numPages)
      })
      .catch(() => {
        if (!cancelled) {
          setError(t('catalog.pdfError'))
          onError?.()
        }
      })

    return () => { cancelled = true }
  }, [url, t, onError])

  if (error) {
    return <div className="catalog-brochure-error">{error}</div>
  }

  if (!pdfDoc) {
    return <div className={loadingMainClass}>{t('empty.loading')}</div>
  }

  return (
    <div className={scrollClass} aria-label={title}>
      {Array.from({ length: numPages }, (_, i) => (
        <CatalogPage key={i + 1} pdfDoc={pdfDoc} pageNum={i + 1} variant={variant} />
      ))}
    </div>
  )
}
