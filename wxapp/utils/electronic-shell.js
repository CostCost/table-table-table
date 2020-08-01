const AtomSize = 6;
const ElectronicSize = 4;
const ShellSize = 14;
const DesignSize = 122;

//TODO 监听内存不足事件 修改图片质量
export default class ElectronicShell {
    constructor(querySelect, data) {
        this.querySelect = querySelect;
        this.data = data;
    }

    _getCanvas() {
        return new Promise(next => {
            if (!this.canvas) {
                const query = wx.createSelectorQuery();
                query.select(this.querySelect)
                    .fields({ node: true, size: true })
                    .exec((res) => {
                        const canvas = res[0].node;
                        const ctx = canvas.getContext('2d');
                        const dpr = wx.getSystemInfoSync().pixelRatio;
                        canvas.width = res[0].width * dpr;
                        canvas.height = res[0].height * dpr;
                        let size = {
                            w: res[0].width,
                            h: res[0].height
                        };
                        let center = {
                            x: size.w / 2,
                            y: size.h / 2
                        };
                        canvas._size = size;
                        canvas._center = center;
                        canvas._s = Math.min(size.w, size.h) / DesignSize;

                        ctx.scale(dpr, dpr);
                        this.canvas = canvas;
                        next(this.canvas);
                    })
            } else {
                next(this.canvas);
            }
        });
    }

    /**
     * 需要await
     * @param {*} formula 'K2-L8-M2-N0-O0-P0-Q0-R0'
     * @param {*} gradual boolean
     */
    async getImage(formula, gradual) {
        let datas = (formula || '').split('-');
        if (datas.length != 8) {
            console.error('电子层式错误');
            return null;
        }

        // 转换成数字
        datas = datas.map(d => {
            return parseInt(d.trim().substr(1) || '0');
        })

        let canvas = await this._getCanvas();
        let size = canvas._size;
        let scale = canvas._s;
        let center = canvas._center;
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, size.w, size.h);

        // 绘制原子
        this._drawAtom(scale, center, ctx);

        // 绘制电子层
        for (let i = 1; i <= 8; i++) {
            this._drawShell(scale, center, ctx, i, gradual);
        }

        // 绘制电子
        for (let i = 0; i < datas.length; i++) {
            let count = datas[i];
            let shell = i + 1;
            for (let j = 0; j < count; j++) {
                this._drawElectronic(scale, center, shell, ctx, j + 1, count);
            }
        }

        let image = canvas.toDataURL('image/png'/*, 1*/);
        return image;
    }

    // 绘制电子
    _drawElectronic(scale, center, shell, ctx, elecNum, eleTotal) {
        let angle = (Math.PI * 2) * (elecNum / eleTotal);
        let p = this._getRotatePos((AtomSize + ShellSize * shell) * scale / 2, angle);

        let color = '#ffffff';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(center.x + p.x, center.y + p.y, ElectronicSize * scale / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    // 绘制电子层
    _drawShell(scale, center, ctx, shell, gradual) {
        let color = `rgba(255,255,255, ${gradual ? (8+1 - shell) / 8 : 1})`;

        ctx.lineWidth = 1.2 * scale / 2;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(center.x, center.y, (AtomSize + ShellSize * shell) * scale / 2, 0, 2 * Math.PI);
        ctx.stroke();

    }

    // 绘制原子
    _drawAtom(scale, center, ctx) {
        let color = '#ffffff';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(center.x, center.y, AtomSize * scale / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    _getRotatePos(dir, angle)//Angle为正时逆时针转动, 单位为弧度
    {
        let x = 0;
        let y = -dir;
        var A, R;
        A = Math.atan2(y, x)//atan2自带坐标系识别, 注意X,Y的顺序
        A += angle//旋转
        R = Math.sqrt(x * x + y * y)//半径
        return {
            x: Math.cos(A) * R,
            y: Math.sin(A) * R
        }
    }
}