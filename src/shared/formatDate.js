import moment from 'moment'

export const useFormatDates = () => {
  const formatDateToBRNotation = (date) => (
    moment(date).format('DD/MM/YYYY')
  )
  return {
    formatDateToBRNotation,
  }
}

export default useFormatDates
