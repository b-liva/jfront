export const baseFunctions = {
  methods: {
    noNode: (data) => {
      if(data.edges.length !== 0){
        return data.edges.map(e => e = e.node)
      }
    }
  }
}
