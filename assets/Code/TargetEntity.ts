import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TargetEntity')
export class TargetEntity extends Component {
    @property({ type: Label, tooltip: '显示数值的文本组件' })
    numLabel: Label = null;

    @property({ tooltip: '当前目标的数值' })
    value: number = 5;

    start() {
        if (this.numLabel) {
            this.numLabel.string = this.value.toString();
        }
    }
}