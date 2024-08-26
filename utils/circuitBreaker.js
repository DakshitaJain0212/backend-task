class CircuitBreaker {
    constructor() {
      this.failedAttempts = 0;
      this.state = 'CLOSED';
      this.failureThreshold = 5;
      this.resetTimeout = 60000; // 1 minute
    }
  
    fail() {
      this.failedAttempts++;
      if (this.failedAttempts > this.failureThreshold) {
        this.state = 'OPEN';
        setTimeout(() => {
          this.failedAttempts = 0;
          this.state = 'CLOSED';
        }, this.resetTimeout);
      }
    }
  
    succeed() {
      this.failedAttempts = 0;
      this.state = 'CLOSED';
    }
  
    isOpen() {
      return this.state === 'OPEN';
    }
  }
  
  module.exports = CircuitBreaker;
  