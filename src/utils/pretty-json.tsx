import { prettyPrintJson } from 'pretty-print-json';
import * as React from 'react';

export type PrettyJsonProps = {
  data: unknown;
};

export const PrettyJson: React.FunctionComponent<PrettyJsonProps> = props => {
  return (
    <pre
      style={{
        fontWeight: 'normal',
        maxHeight: '80vh',
        overflow: 'auto',
        border: 'solid 0.1rem lightgrey'
      }}
      className="json-container"
      dangerouslySetInnerHTML={{
        __html: prettyPrintJson.toHtml(props.data, {
          indent: 2,
          lineNumbers: false,
          quoteKeys: true
        })
      }}
    />
  );
};
