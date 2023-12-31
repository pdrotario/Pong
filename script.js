const canvaEl  = document.querySelector("canvas"),
    canvaCtx = canvaEl.getContext("2d"),
    gapX     = 10

function setup(){
    canvaEl.width   = canvaCtx.width  = window.innerWidth
    canvaEl.height  = canvaCtx.height = window.innerHeight
}

setup()

const mouse ={
    x:0,
    y:0
}
const field = {
    w: canvaCtx.width,
    h: canvaCtx.height,
    draw: function(){
        canvaCtx.fillStyle = "#286047"
        canvaCtx.fillRect(0,0,this.w,this.h)
    }
}
const line = {
    w: 20,
    h: canvaCtx.height,
    draw: function(){
        canvaCtx.fillStyle = "#ffffff"
        canvaCtx.fillRect(
            ( (field.w/2)-5),
            0,
            this.w,
            this.h)
    }
}
const leftPaddle = {
    x: gapX,
    y: 100,
    w: 20,
    h: 200,
    _move : function(){
        this.y = mouse.y - this.h/2
    },
    draw: function(){
        canvaCtx.fillStyle = "#ffffff"
        canvaCtx.fillRect(this.x,this.y,this.w,this.h)

        this._move()
    }
}
const rightPaddle = {
    x: field.w - gapX - 20,
    y: 100,
    w: 20,
    h: 200,
    speed : 3,
    _move : function(){
        if(this.y + this.h/2 < ball.y+ball.r){
            this.y += this.speed
        }else{
            this.y -= this.speed
        }
    },
    speedUp : function(){
        this.speed++
    },
    draw : function(){
        canvaCtx.fillStyle = "#ffffff"
        canvaCtx.fillRect(this.x,this.y,this.w,this.h)
        this._move()
    }
}
const score = {
    human: 0,
    machine: 0,
    increaseHuman : function(){
        this.human++
    },
    increaseMachine : function(){
        this.machine++
    },
    draw : function(){
        canvaCtx.font = "bold 72px Arial"
        canvaCtx.textAlign = "center"
        canvaCtx.textBaseline = "top"
        canvaCtx.fillStyle    = "#01341D"
        canvaCtx.fillText(this.human, field.w / 4, 50)
        canvaCtx.fillText(this.machine, (field.w / 4 + field.w / 2), 50)
    }
}
const ball = {
    x: field.w/2,
    y: field.h/2,
    r: 20,
    speed : 7,
    directionX : 1,
    directionY : 1,
    _serve : function(){
        this.x = field.w/2
        this.y = field.h/2
    },
    _calcPosition : function(){
        if( (this.y < 0) || (this.y > field.h - this.r) ){
            this._reverseY()
        }

        if (this.x < leftPaddle.w+gapX+this.r){
            if(this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h){
                this._reverseX()
            }else{
                score.increaseMachine()
                this._serve()
            }
        }

        if (this.x > field.w-rightPaddle.w-gapX-this.r) {
            if(this.y+this.r > rightPaddle.y &&
                this.y - this.r < rightPaddle.y + rightPaddle.h){
                this._reverseX()
            }else{
                score.increaseHuman()
                rightPaddle.speedUp()
                this.speed++
                this._serve()
            }
        }


    },
    _reverseY : function(){
        this.directionY *= -1
    },
    _reverseX : function(){
        this.directionX *= -1
    },
    _move : function(){
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    draw : function(){
        canvaCtx.fillStyle = "#ffffff"
        canvaCtx.beginPath()
        canvaCtx.arc(this.x,this.y,this.r,0,2*Math.PI, false)
        canvaCtx.fill()
        this._calcPosition()
        this._move()
    },
}

function draw(){
    field.draw()
    line.draw()
    leftPaddle.draw()
    rightPaddle.draw()
    score.draw()
    ball.draw()
}

window.animateFrame = (function(){
    return(
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback){
            return window.setTimeout(callback, 1000/60)
        }
    )
})()

function main(){
    animateFrame(main)
    draw()
}
main()

canvaEl.addEventListener('mousemove',function(e){
    mouse.y = e.pageY
})