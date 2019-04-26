import React from 'react'

class app extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({ data })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return <h1>Hello World!</h1>
  }
}

export default app
