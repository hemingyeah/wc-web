//个人信息控制器
app.controller('personalInfoCtrl', ['$scope', '$state', '$http', 'CityData', 'Upload', 'httpService',
    function($scope, $state, $http, CityData, Upload, httpService) {

        //提交验证
        $scope.submit = function(userForm) {
            userForm.$setDirty();
            if (userForm.$valid) {
                alert("提交成功！");
            }
        };
        $scope.selected = {};
        //省市区选择
        var user = $scope.user = {};
        user.provinces = CityData;
        // 更换省的时候清空市
        $scope.$watch('user.province', function(province) {
            user.city = null;
        });
        // 更换市的时候清空区
        $scope.$watch('user.city', function(city) {
            user.area = null;
        });
        //下拉列表选项
        var that = this;
        that.query = {};
        that.query.exampleList = {};
        $scope.exampleList = {};
        $scope.exampleData = [{
            id: 1,
            name: 'example1'
        }, {
            id: 2,
            name: 'example2'
        }, {
            id: 3,
            name: 'example3'
        }, {
            id: 4,
            name: 'example4'
        }, {
            id: 5,
            name: 'example5'
        }];

        $scope.exampleSelect = [{
            id: 1,
            name: 'example11'
        }, {
            id: 2,
            name: 'example22'
        }, {
            id: 3,
            name: 'example33'
        }, {
            id: 4,
            name: 'example44'
        }, {
            id: 5,
            name: 'example55'
        }];

        //进度条
        $scope.max = 100;
        $scope.random = function() {
            var value = 100;
            $scope.dynamic = value;
            $scope.dynami = 65;
        };
        $scope.random();


        //行内编辑提示框
        //$scope.showtooltip = false;
        //$scope.value = '点击这里编辑内容';
        //$scope.oldVal = $scope.value;
        //$scope.saveTooltip = function(){
        //    $scope.showtooltip = false;
        //    if ($scope.value == ''){
        //        $scope.value = '请输入';
        //        $scope.oldVal = '请输入';
        //    }
        //    else{
        //        $scope.oldVal = $scope.value;
        //    }
        //}
        //$scope.cancelTooltip= function(){
        //    $scope.showtooltip = false;
        //    $scope.value =$scope.oldVal;
        //}
        //$scope.toggleTooltip = function(e){
        //    e.stopPropagation();
        //    $scope.showtooltip = !$scope.showtooltip;
        //}
        $scope.model = {
            // name: '某某某qq',
            // phone: '12314567890qq',
            // age: 'ageqq',
            // text: 'This is a exampleqq!',
            // select: 'Thisqq...'
        };
        $scope.event = {
            save: function() {
                console.log($scope.selected.val)
            },
            test: function() {
                console.log($scope)
            }
        }


    //上传控件
	$scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            Upload.upload({
                url:'/uploadFile_api/file/upload',
                headers: {"Content-Type": "multipart/form-data"},
                data: {file: file}
            }).then(function (resp) {
                if(resp.data.code == '0'){
                    debugger
                    //$scope.callSrc = 'http://192.168.6.93' + resp.data.data.path; //回显图片地址
                    $scope.callSrc = 'http://localhost:8081/' + resp.data.data.path;
                }
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                $scope.f.progress = progressPercentage; //上传进度%
            });

        }
    }
    }]);