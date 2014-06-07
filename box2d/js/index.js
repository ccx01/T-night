//因为要不停的操作js，所以，可能需要再写一个即时刷新的function
function init(scale) {
   var    b2Vec2 = Box2D.Common.Math.b2Vec2
   ,      b2BodyDef = Box2D.Dynamics.b2BodyDef
   ,      b2Body = Box2D.Dynamics.b2Body
   ,      b2FixtureDef = Box2D.Dynamics.b2FixtureDef
   ,      b2World = Box2D.Dynamics.b2World
   ,      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
   ,      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
   ,      b2RevoluteJointDef=Box2D.Dynamics.Joints.b2RevoluteJointDef
   ,      b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
   ,      b2DebugDraw = Box2D.Dynamics.b2DebugDraw
   ,      b2Fixture = Box2D.Dynamics.b2Fixture
   ,      b2AABB = Box2D.Collision.b2AABB;
   

   var world = new b2World(
         new b2Vec2(0, 0)    //gravity
      ,  true                 //allow sleep
   );
   var world_width = 900,      //世界大小，为了让比例可以随时转换
       world_height = 600;
   
   var fixDef = new b2FixtureDef;
   fixDef.density = 1.0;         //定义密度
   fixDef.friction = 0.5;        //定义摩擦系数
   fixDef.restitution = 0.5;     //定义恢复系数,就是弹性
   
   var bodyDef = new b2BodyDef;

   //create ground
   bodyDef.type = b2Body.b2_staticBody;   //定义物体类型
   fixDef.shape = new b2PolygonShape;     //定义形状
   fixDef.shape.SetAsBox(world_width, 2);          //定义尺寸
   bodyDef.position.Set(world_width/2, world_height); //定义位置
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   bodyDef.position.Set(world_width/2, 0);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   fixDef.shape.SetAsBox(2, world_height);
   bodyDef.position.Set(0, world_height/2);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   bodyDef.position.Set(world_width, world_height/2);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   
   //setup debug draw
   var debugDraw = new b2DebugDraw();
   debugDraw.SetSprite($("#canvas").get(0).getContext("2d"));
   debugDraw.SetDrawScale(scale);      //缩放比例，整个界面透视
   debugDraw.SetFillAlpha(0.5);       //透明度
   debugDraw.SetLineThickness(1.0);   //线条粗细，感觉没什么用
   debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
   world.SetDebugDraw(debugDraw);
   
   //mouse
   
   var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
   var canvasPosition = getElementPosition($("#canvas").get(0));
   
   $(document).mousedown(function(e){
      isMouseDown = true;
      handleMouseMove(e);
      $(document).mousemove(function(e){
         handleMouseMove(e);
      });
   });

   $(document).mouseup(function(){
      $(document).off("mousemove");
      isMouseDown = false;
      mouseX = undefined;
      mouseY = undefined;
   });
   
   function handleMouseMove(e) {
      mouseX = (e.clientX - canvasPosition.x) / scale;
      mouseY = (e.clientY - canvasPosition.y) / scale;
   };
   
   function getBodyAtMouse() {
      mousePVec = new b2Vec2(mouseX, mouseY);
      var aabb = new b2AABB();
      aabb.lowerBound.Set(mouseX - 0.0001, mouseY - 0.0001);
      aabb.upperBound.Set(mouseX + 0.0001, mouseY + 0.0001);
      
      // Query the world for overlapping shapes.

      selectedBody = null;
      world.QueryAABB(getBodyCB, aabb);
      return selectedBody;
   }

   function getBodyCB(fixture) {
      if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
         if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
            selectedBody = fixture.GetBody();
            return false;
         }
      }
      return true;
   }
   
   //update

   var context=$("#canvas").get(0).getContext("2d")

   window.setInterval(update, 1000 / 60);   

   function elem(ele,len){

   //create some objects
   //创建元素，包含贴图
   
      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.userData = ele.name;
      fixDef.shape = new b2CircleShape(len);
      bodyDef.position.Set(30, 30);
      ele = world.CreateBody(bodyDef);
      ele.CreateFixture(fixDef);
      return ele;
   }
   

   function eleimg(ele,img,len){
      world.DrawDebugData();


      //贴图
      var pos = ele.GetPosition();
      context.save();
      context.translate(pos.x*scale, pos.y*scale);
      context.rotate(ele.GetAngle());
      context.drawImage(img, -len*scale, -len*scale, len*scale*2 , len*scale*2);
      context.restore();
      //贴图结束

      world.ClearForces();
   }

      var p1 = {};
      p1.name="p1";

      var img = new Image();
         img.src = "image/48x48.png";
      var len = 24; //贴图的尺寸，此处为圆形的半径   

      var p=elem(p1,len);
      var p1f = function(){
         eleimg(p,img,len);
      }
         window.setInterval(p1f, 1000/60);

   function update() {
   
   //鼠标监听
      if(isMouseDown && (!mouseJoint)) {
         var body = getBodyAtMouse();
         if(body) {
            var md = new b2MouseJointDef();
            md.bodyA = world.GetGroundBody();
            md.bodyB = body;
            md.target.Set(mouseX, mouseY);
            md.collideConnected = true;
            md.maxForce = 300 * body.GetMass();   //鼠标拖动的力量
            mouseJoint = world.CreateJoint(md);
            body.SetAwake(true);
         }
      }
      
      if(mouseJoint) {
         if(isMouseDown) {
            mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
         } else {
            world.DestroyJoint(mouseJoint);
            mouseJoint = null;
         }
      }
   //鼠标监听结束
   
      world.Step(1 / 60, 10, 10);
      world.SetContactListener(listener);//碰撞监听器

      document.onkeypress=swtkeyboard; //按键监控
   };
   
   //helpers
   
   //http://js-tut.aardon.de/js-tut/tutorial/position.html
   function getElementPosition(element) {        
      var elem=element, tagname="", x=0, y=0;
     
      while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
         y += elem.offsetTop;
         x += elem.offsetLeft;
         tagname = elem.tagName.toUpperCase();

         if(tagname == "BODY")
            elem=0;

         if(typeof(elem) == "object") {
            if(typeof(elem.offsetParent) == "object")
               elem = elem.offsetParent;
         }
      }

      return {x: x, y: y};
   }


   //碰撞检测，可独立一个js文件专门对技能进行处理
   var listener = new Box2D.Dynamics.b2ContactListener;
        listener. BeginContact = function(contact) {
         var skill="gongji"; //技能设置为数组，做一遍循环，把所有技能列入，技能必须登记在bodydef.userdata里面
             if (contact.GetFixtureA().GetBody().GetUserData()== skill || contact.GetFixtureB().GetBody().GetUserData()== skill ){
               hit=skill;
             }
             //分别设置对战的角色如p1,p2受到各种效果碰撞后的伤害
             //contact.GetFixtureA().GetBody().GetUserData() 触发碰撞的物体A和物体B
             if (contact.GetFixtureA().GetBody().GetUserData()== 'p2' || contact.GetFixtureB().GetBody().GetUserData()== 'p2')  // think about why we don't use fixture's userData directly.
                 switch(hit){
                  case "gongji": alert("hit by gongji");//各个技能产生不同的效果
                  break;
                  default:alert("ground");
                 }
                 
                 }
        listener. EndContact = function(contact) {
             if (contact.GetFixtureA().GetBody().GetUserData()== 'p1' || contact.GetFixtureB().GetBody().GetUserData()== 'p1' || contact.GetFixtureA().GetBody().GetUserData()== 'p2' || contact.GetFixtureB().GetBody().GetUserData()== 'p2' )
                 hit="";//技能结束，进行清空
                 }
   //碰撞检测结束
var ss;
   //键盘监听
   function swtkeyboard(e){
      var evtobj=window.event? event : e 
      var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode
      var actualkey=String.fromCharCode(unicode)

   if (actualkey=="j"){
      //生成技能效果
      var p2_image = new Image();
      p2_image.src = "image/48x48.png";
      var p2_size = 24; //贴图的尺寸，此处为圆形的半径         
      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.userData = 'p2';
      fixDef.shape = new b2CircleShape(p2_size);
      bodyDef.position.Set(30, 30);
      p2 = world.CreateBody(bodyDef);
      p2.CreateFixture(fixDef);
      var aa=function(){
      var pos = p2.GetPosition();    
      context.save();
      context.translate(pos.x*scale, pos.y*scale);
      context.rotate(p2.GetAngle());
      context.drawImage(p2_image, -p2_size*scale, -p2_size*scale, p2_size*scale*2 , p2_size*scale*2);
      context.restore();
      console.log("a is run");
      }
      ss=setInterval(aa, 1000/60);
      p2.SetLinearVelocity(new b2Vec2(0,-1000));
   }
   if (actualkey=="k"){
      clearInterval(ss);
      delete p2;
   }
   }
   //键盘监听结束
};

