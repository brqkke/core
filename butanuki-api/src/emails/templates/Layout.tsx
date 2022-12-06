import React from 'react';

export const Layout = (
  props: React.PropsWithChildren<{ subtitle: string }>,
) => {
  return (
    <html>
      <body>
        <h1 style={{ textAlign: 'center', marginTop: '1em' }}>Butanuki</h1>
        <div
          style={{
            maxWidth: '54em',
            margin: '1em auto',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ['msoElementFrameWidth']: '54em',
            ['msoElement']: 'para-border-div',
            ['msoElementLeft']: 'center',
            ['msoElementWrap']: 'no-wrap-beside',
            backgroundColor: '#efefef',
            borderRadius: '0.5em',
          }}
        >
          <div
            style={{
              maxWidth: '50em',
              margin: '2em auto',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ['msoElementFrameWidth']: '50em',
              ['msoElement']: 'para-border-div',
              ['msoElementLeft']: 'center',
              ['msoElementWrap']: 'no-wrap-beside',
              padding: '2em 1em',
            }}
          >
            <h2>{props.subtitle}</h2>
            {props.children}
          </div>
        </div>
        <table width="100%" border={0} cellSpacing="0" cellPadding="0">
          <tr>
            <td style={{ textAlign: 'center' }}>
              <small>
                Butanuki - <a href={'https://butanuki.com'}>Butanuki.com</a>
              </small>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};
