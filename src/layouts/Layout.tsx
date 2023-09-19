/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {ReactChildren, ReactChild} from "react";
import styles from "./layout.module.css";
import utilStyles from "./utils.module.css";

interface AuxProps {
  children: ReactChild | ReactChildren;
  home: boolean;
}

const name = "Fast Style Transfer for Arbitrary Styles";
export const siteTitle = "Fast Style Transfer for Arbitrary Styles Demo";

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  //return <div className={styles.container}>{children}</div>
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {home ? (
          <>
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <a href="/">
              <a>
                <img
                  src="/images/profile.jpg"
                  className={utilStyles.borderCircle}
                  height={108}
                  width={108}
                  alt={name}
                />
              </a>
            </a>
            <h2 className={utilStyles.headingLg}>
              <a href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </a>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <a href="/">
            <a>← Back to home</a>
          </a>
        </div>
      )}
    </div>
  );
}
