import { EventHub } from "./event-hub";

describe("测试 EventHub", () => {
  let eventHub: EventHub;
  beforeEach(() => {
    eventHub = new EventHub();
  });
  it("可以创建 EventHub 实例", () => {
    expect(eventHub).toBeTruthy();
  });
  it("实例上有 on、emit、off 方法", () => {
    expect(typeof eventHub.on).toBe("function");
    expect(typeof eventHub.emit).toBe("function");
    expect(typeof eventHub.off).toBe("function");
  });
  it("测试先 on 一个事件, 再 emit, callback 被触发", () => {
    const fakeFn = jest.fn();
    const testEventName = "test";
    eventHub.on(testEventName, fakeFn);
    eventHub.emit(testEventName);
    expect(fakeFn).toHaveBeenCalledTimes(1);
  });
  it("测试 callback 被触发时，可以收到 data 参数", () => {
    const fakeFn = jest.fn();
    const testEventName = "test";
    const testData = { name: "1234" };
    eventHub.on(testEventName, fakeFn);
    eventHub.emit(testEventName, testData);
    expect(fakeFn).toHaveBeenCalledWith(testData);
  });
  it("测试先 on, 再 off, 就不会收到 emit 事件", () => {
    const fakeFn = jest.fn();
    const testEventName = "test";
    eventHub.on(testEventName, fakeFn);
    eventHub.off(testEventName, fakeFn);
    eventHub.emit(testEventName);
    expect(fakeFn).toHaveBeenCalledTimes(0);
  });
});
