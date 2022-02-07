import styles from './styles.module.scss'

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <a href="/">
          <img src="/images/logo.svg" alt="logo" />
        </a>
      </div>
    </header>
  )
}
