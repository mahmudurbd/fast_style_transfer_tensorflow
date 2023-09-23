/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactChildren, ReactChild } from 'react'
import styles from './layout.module.css'
import utilStyles from './utils.module.css'
import Appbar from '../components/Appbar/Appbar'

interface AuxProps {
  children: ReactChild | ReactChildren
  home: boolean
}

const name = 'Fast Style Transfer for Arbitrary Styles'
export const siteTitle = 'Fast Style Transfer for Arbitrary Styles Demo'

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode
  home?: boolean
}) {
  //return <div className={styles.container}>{children}</div>
  return (
    <>
      <Appbar />
      <div className={styles.container}>
        <main>{children}</main>
        {!home && (
          <div className={styles.backToHome}>
            <a href='/'>
              <a>← Back to home</a>
            </a>
          </div>
        )}
      </div>
    </>
  )
}
