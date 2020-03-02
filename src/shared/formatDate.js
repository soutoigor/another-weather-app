import moment from 'moment'

export const useFormatDates = () => {
  const formatDateToBRNotation = (date) => (
    moment(date).format('DD/MM')
  )

  const formatToHourAndMinutes = (date) => (
    moment(date).format('HH:mm')
  )
  return {
    formatDateToBRNotation,
    formatToHourAndMinutes,
  }
}

export default useFormatDates
