export class BasePlugin {
  private static instance;
  constructor() {
    if (BasePlugin.instance) {
      throw new Error("Error - use Class.getInstance()");
    }
  }
  public static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
}