import React from 'react';

function DataList(props) {
  const data = props.data;
  const listitems = data.map((data) => <li key={data.toString()}>{data}</li>);
  return <ul>{listitems}</ul>;
}

export default DataList;