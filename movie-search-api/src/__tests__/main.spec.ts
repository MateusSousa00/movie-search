import { NestFactory } from '@nestjs/core';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('bootstrap', () => {
  const enableCorsMock = jest.fn();
  const listenMock = jest.fn();

  const mockApp = {
    enableCors: enableCorsMock,
    listen: listenMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  it('should initialize create app, enable CORS, and start server', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await jest.isolateModulesAsync(async () => {
      require('../main');
      await Promise.resolve();
    });

  
    expect(NestFactory.create).toHaveBeenCalledTimes(1);
    expect(NestFactory.create).toHaveBeenCalledWith(expect.any(Function));
    expect(enableCorsMock).toHaveBeenCalledWith({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    });

    const expectedPort = process.env.PORT || 3001;
    expect(listenMock).toHaveBeenCalledWith(expectedPort);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Backend is running on http://localhost:${expectedPort}`,
    );

    consoleSpy.mockRestore();
  });
});
