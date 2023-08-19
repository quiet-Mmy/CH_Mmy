const orderReturn = []
for (let i = 1; i < 31; i++) {
  orderReturn.push({
    date: '2023-08-' + (i > 9 ? i : '0' + i),
    order: randomNum(0, 10),
    returnNum: randomNum(0, 10)
  })
}
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export default orderReturn
