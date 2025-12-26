export interface MockOptions {
  delay?: number;
  failRate?: number;
}

const defaultOptions: Required<MockOptions> = {
  delay: 500,
  failRate: 0.1
};

export const mockClient = {
  async request<T>(data: T, options: MockOptions = {}): Promise<T> {
    const { delay, failRate } = { ...defaultOptions, ...options };
    await new Promise((resolve) => setTimeout(resolve, delay));
    if (Math.random() < failRate) {
      throw new Error("Mock network error");
    }
    return data;
  }
};
