import Head from 'next/head'
import styles from '../styles/Home.module.css'
import EventGrid from '../components/EventGrid'
import useCurrentUser from '../hooks/useCurrentUser'

export default function Home() {
  const { loggedIn } = useCurrentUser()

  return (
    <div className={styles.container}>

      <Head>
        <title>Events App - Get Your NFT Ticket for Event Here</title>
        <meta name="description" content="NFT Ticket using Flow Blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to EventX
        </h1>

        <EventGrid />                                          
      </main>
    </div>
  )
}
