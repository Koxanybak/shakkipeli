export const handleApolloError = err => {
  if (!err.graphQLErrors || !err.graphQLErrors[0]) {
    console.log(err.message)
    if (err.stack) {
      console.log(err.stack)
    }
  } else {
    console.log(err.graphQLErrors[0].message)
    if (err.graphQLErrors[0].stack) {
      console.log(err.graphQLErrors[0].stack)
    }
  }
}