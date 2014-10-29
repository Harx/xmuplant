angular.module("app.controllers",[])
    .controller("homeCtrl",["$scope","$http",function($scope,$http){
        $scope.home={
            species:[
                {
                    name_cn:"",
                    name_en:"",
                    img_name:""
                }
            ],
            currentImg:"",
            divisions:[
                {
                    id:"1",
                    title:"被子植物门 Angiospermae",
                    content:"是植物界最大和最高级的1门。种类繁多，分为双子叶和单子叶植物纲。厦大校园据2011-12年调查有355种，隶属93科245属。",
                    img:"beizi.jpg"
                },
                {
                    id:"2",
                    title:"裸子植物门 Gymnospermae",
                    content:"多为常绿乔木。种子裸露，没有果皮包被。具有根，茎，叶，种子四种器官。厦大校园有12种，隶属6科9属。",
                    img:"luozi.jpg"
                },
                {
                    id:"3",
                    title:"蕨类植物门 Pteridophyta",
                    content:"高等植物中较低级的一类，多为草本。具根、茎、叶，无花、果、种子，靠孢子繁殖。厦大校园有7种，5科5属。",
                    img:"juelei.jpg"
                }
            ],
            sections:[
                {
                    title:"植物专题",
                    img:"zhiwuzhuanti.png",
                    href:"#/topic"
                },
                {
                    title:"系统分类",
                    img:"tezhengshaixuan.png",
                    href:"#/category"
                },
                {
                    title:"植物地图",
                    img:"zhiwuditu.png",
                    href:"#/map"
                },
                {
                    title:"扩展知识",
                    img:"kuozhanzhishi.png",
                    href:"#/knowledge"
                }
            ]
        };
        $http.get("db/latestSpecies.php").
            success(function(data){
                $scope.home.species=data;
                $scope.home.currentImg=$scope.home.species[0].name_cn;
            }).
            error(function(data,status){

            });
    }])
    .controller("footerCtrl",["$scope","$http",function($scope,$http){
        $scope.statics={};
        $http({
            method:"get",
            url:"db/statics.php",
            params:""
        }).success(function(data){
                $scope.statics=data;
            });
    }])
    .controller("navigationCtrl",["$scope","$location",function($scope,$location){
        $scope.isActive=function(route){
            return $location.path().indexOf(route)==0?true:false;
        }
        $scope.search = function(){
          if ($scope.keyword){
            $location.path("/search/" + $scope.keyword);
            $scope.keyword = '';
          }
        }
    }])
    .controller("mapCtrl",["$scope","$http",function($scope,$http){
        $scope.species={
            id:"",
            name_cn:"",
            name_en:"",
            name_ot:"",
            division:"",
            family:"",
            genus:"",
            distribution:"",

            longitude:"",
            latitude:""
        };
        $http.get("db/map.php").
            success(function(data){
                $scope.mapp=data;
                var species=data;

                var map=new BMap.Map("map");
                map.addControl(new BMap.MapTypeControl());//添加地形控制器
                map.enableScrollWheelZoom();//设置鼠标滚轮缩放为启用
                map.centerAndZoom(new BMap.Point(118.105219, 24.443082), 17);

                for(var i=0;i<species.length;i++){
                    var longitudeArr=species[i].longitude.split(',');
                    var latitudeArr=species[i].latitude.split(',');
                    var name_cn=species[i].name_cn;
                    var name_en=species[i].name_en;
                    var id=species[i].id;

                    for(var j=0;j<longitudeArr.length;j++){
                        var marker=new BMap.Marker(new BMap.Point(longitudeArr[j],latitudeArr[j]));
                        map.addOverlay(marker);

                        // 参考: 《javascrpt语言精粹》 p39页闭包。
                        (function(mId){
                          var mInfo = '<p>' + name_cn+ ' ' + name_en + '</p>';
                          marker.addEventListener("click", function(){
                              this.openInfoWindow(new BMap.InfoWindow(mInfo));
                              $scope.openInfo(mId);
                          });
                        })(id);
                    }
                }
            }).
            error(function(data){

            });

        $scope.openInfo=function(id){
            $http.get("db/r.php?items=id,name_cn,name_en,name_ot,division,family,genus,distribution&id=" + id).
                success(function(data){
                    $scope.species=data[0];

                    var params = "?division=" + data[0].division + "&family=" + data[0].family + "&genus=" + data[0].genus;
                    $http.get("db/species_class.php"+params).
                        success(function(data){
                            $scope.species.division=data['division'];
                            $scope.species.family=data['family'];
                            $scope.species.genus=data['genus'];
                        }).
                        error(function(data){

                        });

                })
        }
    }])
    .controller("categoryCtrl",["$scope","$http",'$routeParams',function($scope,$http,$routeParams){
        $scope.category={
          division: [],
          divisionBool: [],
          family: [],
          familyBool: [],
          genus: []
        }
        
        $http.get("db/r.php?items=*&tables=division").success(function(data){
          $scope.category.division = data;
        });
        
        $scope.division = function(id){
          if ($scope.category.divisionBool[id]){
            $scope.category.divisionBool[id] = false;
          } else {
            $http.get("db/family.php?id=" + id).success(function(data){
              $scope.category.family[id] = data;
              $scope.category.divisionBool[id] = true;
            });
          }
        }
        $scope.family = function(id){
          if ($scope.category.familyBool[id]){
            $scope.category.familyBool[id] = false;
          } else {
            $http.get("db/genus.php?id=" + id).success(function(data){
              $scope.category.genus[id] = data;
              $scope.category.familyBool[id] = true;
            });
          }
        }
        
    }])
    .controller("topicListCtrl",["$scope","$http","$routeParams",function($scope,$http,$routeParams){
        $scope.topic={
            topics:[
                {
                    id:"",
                    title:"",
                    d:""
                }
            ],
            pages:[]
        };
        $http.get("db/pagination.php?table=subject&items=id,title,d&page="+$routeParams.page)
            .success(function(data){
                $scope.topic.topics=data[1];
                $scope.topic.pages=data[0];
            })
            .error(function(data){
                $scope.topic.pages=data;
            });


    }])
    .controller("topicDetailsCtrl",["$scope","$routeParams","$http",function($scope,$routeParams,$http){
        $scope.topicDetails={
            title:"",
            d:"",
            s:[
                {
                    id:"",
                    name_cn:"",
                    name_en:"",
                    img_name:""
                }
            ]
        };
        $http.get("db/topicDetails.php?id="+$routeParams.id)
            .success(function(data){
                $scope.topicDetails=data;
            });
    }])
    .controller("knowledgeListCtrl",["$scope","$routeParams","$http",function($scope,$routeParams,$http){
        $scope.klgList={
            total:"",
            category:[
                {
                    id:"",
                    name:"",
                    count:""
                }
            ],            
            articles:[
                {
                    id:"",
                    title:"",
                    category:""
                }
            ],
            curCat:"",
            pages:[]
        };
        $scope.klgList.curCat=$routeParams.catid;
        $scope.isActive=function(catId){
            return catId==$routeParams.catid;
        }
        $http.get("db/r.php?tables=klg_category&items=id,name").
            success(function(data){
                $scope.klgList.category=data;
                var i=0;l=data.length;
                for(i;i<l;i++){
                    $scope.klgList.category[i].count=0;
                }
            
                //用运算来代替增加数据库count项以及一系列逻辑代码                    
                $http.get("db/pagination.php?table=knowledge&items=category&page="+$routeParams.page).
                    success(function(data){
                        $scope.klgList.total=data[1].length;
                        var arrArt=$scope.klgList.articles = data[1];
                        var arrCat=$scope.klgList.category;         
                        var i=0,l1=arrArt.length,l2=arrCat.length;
                        for(i;i<l1;i++){
                            var j=0;
                            for(j;j<l2;j++){
                                if(arrArt[i].category==arrCat[j].id){
                                    //category statics
                                    arrCat[j].count++;
                                    break;
                                }
                            }
                        } 
                   });
                var s="db/pagination.php?table=knowledge&items=id,title,category&catid="+$routeParams.catid+"&page="+$routeParams.page;
                if($routeParams.catid==0){
                    s="db/pagination.php?table=knowledge&items=id,title,category&page="+$routeParams.page
                }
                $http.get(s).
                    success(function(data){
                        $scope.klgList.pages=data[0];
                        var arrArt=$scope.klgList.articles = data[1];
                        var arrCat=$scope.klgList.category;                
                        var i=0,l1=arrArt.length,l2=arrCat.length;
                        for(i;i<l1;i++){
                            var j=0;
                            for(j;j<l2;j++){
                                if(arrArt[i].category==arrCat[j].id){
                                    arrArt[i].category=arrCat[j].name;
                                    break;
                                }
                            }
                        } 
                   });
            });
    }])
    .controller("knowledgeDetailsCtrl",["$scope","$routeParams","$http",function($scope,$routeParams,$http){
        $scope.klgDetails={
            title:"",
            content:"",
            date:"",
            category:""
        };
        $http.get("db/klgDetails.php?id="+$routeParams.id).
            success(function(data){
               $scope.klgDetails=data[0];
            });
    }])
    .controller("aboutCtrl",["$scope","$routeParams","$http",function($scope,$routeParams,$http){
        $scope.about={};
        if($routeParams.id==5){
            $scope.about.id=5;
            $http.get("db/r.php?tables=sblog&items=*").
                success(function(data){
                    $scope.sblog=data.reverse();
                })
        }else{
            $http({url:"db/r.php",method:"get",params:{tables:"intro",items:"id,title,content",id:$routeParams.id}}).
                success(function(data){
                    $scope.about=data[0];
                })
        }
    }])
    .controller("searchCtrl",["$scope","$http","$routeParams",function($scope,$http,$routeParams){
        $scope.search={
            result:[],
            total:0,
            keyword:$routeParams.keyword
        };
        
        $http.get("db/search.php?keyword="+$scope.search.keyword)
            .success(function (data) {
                $scope.search.result = data.reverse();
                $scope.search.total = data.length;
            });
    }])
    .controller("messagesCtrl",["$scope",function($scope){

    }])
    .controller("speciesDetailsCtrl",["$scope","$routeParams","$http",function($scope,$routeParams,$http){
        $scope.species={
            name_cn:"",
            name_en:"",
            name_ot:"",
            division:"",
            family:"",
            genus:"",
            distribution:"",

            longitude:"",
            latitude:"",

            morphology:"",
            origin:"",
            habitus:"",
            cultivation:"",
            application:"",
            history:""

        };
        $http.get("db/r.php?tables= &items=* &id="+$routeParams.id)
            .success(function(data){
                var s=$scope.species=data[0];

                var imgNames=$scope.species.img_name.split(",");
                $scope.species.imgSrc=imgNames;

                var argument="?division="+ s.division+"&family="+ s.family+"&genus="+ s.genus;
                $http.get("db/species_class.php"+argument).
                    success(function(data){
                        $scope.species.division=data['division'];
                        $scope.species.family=data['family'];
                        $scope.species.genus=data['genus'];
                    }).
                    error(function(data){

                    });


                var map=new BMap.Map("map");
                map.addControl(new BMap.MapTypeControl());//添加地形控制器
                map.enableScrollWheelZoom();//设置鼠标滚轮缩放为启用
                map.centerAndZoom(new BMap.Point(118.105219, 24.443082), 17);

                var longitudeArr=$scope.species.longitude.split(',');
                var latitudeArr=$scope.species.latitude.split(',');
                for(var i=0;i<longitudeArr.length;i++){
                    map.addOverlay(new BMap.Marker(new BMap.Point(longitudeArr[i],latitudeArr[i])));
                }
            })
            .error(function(data){

            });

    }]);
