import { _decorator, Component, Enum, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

// 定义实体类型：怪物或道具
export enum EntityType {
    ENEMY,
    ITEM
}
Enum(EntityType);

@ccclass('TargetEntity')
export class TargetEntity extends Component {
    @property({ type: EntityType })
    public type: EntityType = EntityType.ENEMY;

    @property
    public value: number = 5; // 怪物头顶的数字

    @property(Label)
    public numLabel: Label = null!; // 拖入预制体里的 Label 节点

    start() {
        this.updateLabel();
    }

    // 更新显示的数字
    updateLabel() {
        if (this.numLabel) {
            this.numLabel.string = this.value.toString();
        }
    }

    // 被吃掉时的逻辑
    public onEaten() {
        // 这里可以播放你资源管理器里的 eat_enemies_music
        this.node.destroy();
    }
}