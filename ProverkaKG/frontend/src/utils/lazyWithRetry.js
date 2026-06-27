import { lazy } from 'react'

function markChunkRetry() {
  try {
    sessionStorage.setItem('proverkakg_chunk_retry', '1')
  } catch {
    // ignore
  }
}

function shouldRetryChunk() {
  try {
    return !sessionStorage.getItem('proverkakg_chunk_retry')
  } catch {
    return false
  }
}

export function lazyWithRetry(factory) {
  return lazy(() =>
    factory().catch((error) => {
      if (shouldRetryChunk()) {
        markChunkRetry()
        window.location.reload()
      }
      throw error
    }),
  )
}
