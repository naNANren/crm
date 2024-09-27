layui.use(['form', 'layer'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;





    form.on('submit(addOrUpdateSaleChance)',function (data) {
        var index= layer.msg("数据提交中,请稍后...",{icon:16,
            time:false,
            shade:0.8});
        var url = ctx+"/sale_chance/add";

        var saleChanceId=$("[name='id']").val();
        if (saleChanceId !=null && saleChanceId !=''){
            //更新操作
            url=ctx +"/sale_chance/update";
        }
        $.post(url,data.field,function (result) {
            if(result.code==200){
               layer.msg("操作成功",{icon: 6});
                //关闭加载层
                layer.close(index);
                //关闭弹出层
                layer.closeAll("iframe");
                // 刷新父页面,重新加载数据
                parent.location.reload();
            }else{
                layer.msg(result.msg,{icon:5});
            }
        });
        return false;
    });
    /**
     * 关闭当前弹出层
     */
    $("#closeBtn").click(function (){
        //当你在iframe页面关闭自身时
        var index=parent.layer.getFrameIndex(window.name);//先得到当前iframe层的索引
        parent.layer.close(index);  //再执行关闭
    });
    /**
     * 加载指派人的下拉框
     */
    $.ajax({
        type:"get",
        url:ctx+ "/user/queryAllSales",
        data:{},
        success:function (data){
        // console.log(data);
            //判断返回的数据是否为空
            if (data!=null){
                //获取隐藏域中设置的指派人ID
                var assignManId=$("#assignManId").val();
                //遍历返回的数据
                for (var i=0;i < data.length;i++){
                    var opt="";
                    //如果循环得到的Id与隐藏域中的Id相等,表示被选中
                    if (assignManId == data[i].id){
                      //设置下拉框选项 设置下拉框选择
                          opt="<option value='"+data[i].id+"' selected>"+data[i].uname+"</option>";
                    }else {
                        //设置下拉框选项
                          opt="<option value='"+data[i].id+"'>"+data[i].uname+"</option>";
                    }

                    //将下拉项设置到下拉框中
                    $("#assignMan").append(opt);
                }
            }
            //重新渲染下拉框的内容
            layui.form.render("select")
        }

    });

});