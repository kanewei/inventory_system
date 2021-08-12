class HttpException extends Error {
    status: number;
    message: string;
    data: Error;
    constructor(status: number, message: string, data: Error) {
      super(message);
      this.status = status;
      this.message = message;
      this.data = data;
    }
  }
   
  export default HttpException;