import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerMove')
export class PlayerMove extends Component {
    @property
    speed: number = 300; // 移动速度

    private _moveDir: Vec3 = new Vec3(0, 0, 0); // 移动方向
    private _isW: boolean = false;
    private _isS: boolean = false;
    private _isA: boolean = false;
    private _isD: boolean = false;

    onLoad() {
        // 监听键盘按下
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        // 监听键盘抬起
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        // 销毁时移除监听，是个好习惯
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W: this._isW = true; break;
            case KeyCode.KEY_S: this._isS = true; break;
            case KeyCode.KEY_A: this._isA = true; break;
            case KeyCode.KEY_D: this._isD = true; break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W: this._isW = false; break;
            case KeyCode.KEY_S: this._isS = false; break;
            case KeyCode.KEY_A: this._isA = false; break;
            case KeyCode.KEY_D: this._isD = false; break;
        }
    }

    update(dt: number) {
        // 计算方向
        let x = 0;
        let y = 0;
        if (this._isW) y += 1;
        if (this._isS) y -= 1;
        if (this._isA) x -= 1;
        if (this._isD) x += 1;

        if (x !== 0 || y !== 0) {
            // 设置移动向量并标准化（防止斜着走变快）
            this._moveDir.set(x, y, 0).normalize();
            
            // 计算当前坐标
            let pos = this.node.position;
            // 新坐标 = 旧坐标 + 方向 * 速度 * 时间间隔
            let nextX = pos.x + this._moveDir.x * this.speed * dt;
            let nextY = pos.y + this._moveDir.y * this.speed * dt;
            
            // 更新位置
            this.node.setPosition(nextX, nextY, 0);
        }
    }
}