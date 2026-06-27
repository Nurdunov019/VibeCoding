import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  handleReload = () => {
    try {
      sessionStorage.removeItem('proverkakg_chunk_retry')
    } catch {
      // ignore
    }
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    const isChunkError = /Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
      String(this.state.error?.message || this.state.error),
    )

    return (
      <div className="error-boundary">
        <h2>{isChunkError ? 'Жаңылоо керек' : 'Ката кетти'}</h2>
        <p>
          {isChunkError
            ? 'Сайт жаңыланды. Баракты кайра жүктөңүз.'
            : 'Баракча жүктөлбөй калды. Кайра аракет кылыңыз.'}
        </p>
        <button type="button" className="btn-accent" onClick={this.handleReload}>
          Кайра жүктөө
        </button>
      </div>
    )
  }
}
