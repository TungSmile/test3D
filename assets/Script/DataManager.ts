import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: any = null;
    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }
        return this._instance
    }

    static get instance() {
        return this.getInstance<DataManager>()
    }

    public isRun: boolean = false;
    public speed: number = 0;
    public point: number = 0;
    public angle: number = 0;




    public redirect: boolean = false;
    public isTurnRight: boolean = false;

}

