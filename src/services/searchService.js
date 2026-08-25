import api from './api'

export const searchManga = async (
  searchText,
) => {
  try {
    const response = await api.get('/search/', {
      params: {
        search_expression: searchText,
        filters: []
      }
    })

    return response.data
  } catch (error) {
    console.error(error)

    if (error.response) {
      throw error.response.data
    }

    throw error
  }
}
