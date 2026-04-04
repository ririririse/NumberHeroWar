import { _decorator, Component, Node, Label, Contact2DType, Collider2D, IPhysics2DContact, AudioSource, AudioClip, CCInteger } from 'cc';
import { TargetEntity, EntityType } from './TargetEntity';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Label)
    numLabel: Label = null!; 

    @property(CCInteger)
    currentPower: number = 10; // 初始数值

    @property(AudioClip)
    eatEnemySound: AudioClip = null!; 
    @property(AudioClip)
    eatItemSound: AudioClip = null!;  

    private _audioSource: AudioSource = null!;

    onLoad() {
        this._audioSource = this.getComponent(AudioSource) || this.addComponent(AudioSource);
        this.updateLabel();
    }

    start() {
        // 注册碰撞监听
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    updateLabel() {
        this.numLabel.string = this.currentPower.toString();
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        const target = other.node.getComponent(TargetEntity);
        if (!target) return;

        if (this.currentPower >= target.power) {
            // 胜利逻辑
            this.currentPower += target.power;
            this.updateLabel();
            
            // 播放音效
            const clip = target.type === EntityType.ENEMY ? this.eatEnemySound : this.eatItemSound;
            this._audioSource.playOneShot(clip, 1);

            // 销毁目标
            other.node.destroy();
        } else {
            console.log("数值不足！");
        }
    }
}