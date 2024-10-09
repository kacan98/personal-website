const DEV = process.env.NODE_ENV === 'development'
export const log = (...messages: any[]) => {
  if (DEV) {
    console.log(...messages)
  }
}
