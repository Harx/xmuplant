angular.module("app.controllers", [])
    .controller("homeCtrl", ["$scope", "$http",
        function ($scope, $http) {
            $scope.home = {
                species: [
                    {
                        name_cn: "",
                        name_en: "",
                        img_name: ""
                    }
                ],
                currentImg: "",
                divisions: [
                    {
                        id: "1",
                        title: "被子植物门 Angiospermae",
                        content: "是植物界最大和最高级的1门。种类繁多，分为双子叶和单子叶植物纲。厦大校园据2011-12年调查有355种，隶属93科245属。",
                        img: "beizi.jpg"
                    },
                    {
                        id: "2",
                        title: "裸子植物门 Gymnospermae",
                        content: "多为常绿乔木。种子裸露，没有果皮包被。具有根，茎，叶，种子四种器官。厦大校园有12种，隶属6科9属。",
                        img: "luozi.jpg"
                    },
                    {
                        id: "3",
                        title: "蕨类植物门 Pteridophyta",
                        content: "高等植物中较低级的一类，多为草本。具根、茎、叶，无花、果、种子，靠孢子繁殖。厦大校园有7种，5科5属。",
                        img: "juelei.jpg"
                    }
                ],
                sections: [
                    {
                        title: "植物专题",
                        img: "zhiwuzhuanti.png",
                        href: "#/topic"
                    },
                    {
                        title: "系统分类",
                        img: "tezhengshaixuan.png",
                        href: "#/category"
                    },
                    {
                        title: "植物地图",
                        img: "zhiwuditu.png",
                        href: "#/map"
                    },
                    {
                        title: "扩展知识",
                        img: "kuozhanzhishi.png",
                        href: "#/knowledge"
                    }
                ]
            };
            $http.get("db/latestSpecies.php").
            success(function (data) {
                $scope.home.species = data;
                $scope.home.currentImg = $scope.home.species[0].name_cn;
            }).
            error(function (data, status) {

            });
        }])
    .controller("footerCtrl", ["$scope", "$http",
        function ($scope, $http) {
            $scope.statics = {};
            $http({
                method: "get",
                url: "db/statics.php",
                params: ""
            }).success(function (data) {
                $scope.statics = data;
            });
        }])
    .controller("navigationCtrl", ["$scope", "$location",
        function ($scope, $location) {
            $scope.isActive = function (route) {
                return $location.path().indexOf(route) === 0 ? true : false;
            };
            $scope.search = function () {
                if ($scope.keyword) {
                    $location.path("/search/" + $scope.keyword);
                    $scope.keyword = '';
                }
            };
        }])
    .controller("mapCtrl", ["$scope", "$http",
        function ($scope, $http) {
            $scope.species = {
                id: "",
                name_cn: "",
                name_en: "",
                name_ot: "",
                longitude: "",
                latitude: ""
            };
            $http.get("db/map.php").
            success(function (data) {
                var species = data,
                    map = new BMap.Map("map"),
                    //添加地图标记
                    process=function(specie){
                        var longitudeArr = specie.longitude.split(','),
                            latitudeArr = specie.latitude.split(','),
                            img_name = specie.img_name.split(','),
                            src = img_name[0] ? 'http://xmuplant.qiniudn.com/' + img_name[0] : 'upload/default.jpg',
//                          src=img_name[0]?'http://xmuplant-upload.stor.sinaapp.com/'+img_name[0] : 'upload/default.jpg',
                            name_cn = specie.name_cn,
                            name_en = specie.name_en,
                            id = specie.id;
                        for (var j =longitudeArr.length-1; j >=0; j--) {
                            var marker = new BMap.Marker(new BMap.Point(longitudeArr[j], latitudeArr[j]));
                            map.addOverlay(marker);

                            // 参考: 《javascrpt语言精粹》 p39页闭包。
                            (function () {
                                var mInfo =
                                    '<img src="'+src+'" style="height:200px;display:block;margin:0px auto;padding:0px;"/>'
                                    +'<a href="#/species/details/'+id+'" style="display:block;margin:0px auto;padding:0px;">'
                                    + name_cn + ' ' + name_en + '</a>';
                                marker.addEventListener("click", function () {
                                    this.openInfoWindow(new BMap.InfoWindow(mInfo));
                                });
                            })();
                        }
                    },
                    //数组分块技术
                    chunk=function(array,handler){
                        setTimeout(function(){
                            var item=array.shift();
                            handler(item);
                            if(array.length>0){
                                setTimeout(arguments.callee,10);
                            }
                        },0);
                    };
                map.addControl(new BMap.MapTypeControl()); //添加地形控制器
                map.enableScrollWheelZoom(); //设置鼠标滚轮缩放为启用
                map.centerAndZoom(new BMap.Point(118.105219, 24.443082), 17);
                chunk(species,process);
            }).
            error(function (data) {

            });
        }])
    .controller("systemCtrl", ["$scope", '$routeParams', "$http",
        function ($scope, $routeParams, $http) {
            $scope.system = { //不加system无法显示值
                arrDivision: [],
                arrFamily: [],
                arrGenus: [],
                arrSpecies: [],
                division: {
                    id: $routeParams.dId,
                    title: ""
                },
                family: {
                    id: $routeParams.fId,
                    title: "family"
                },
                genus: {
                    id: $routeParams.gId,
                    title: "genus"
                },
                curID:{
                    d:null,
                    f:null,
                    g:null
                },
                info: "hi",
                list: []
            };

            var setDivision = function () {
                // #/0/0/0
                $http.get("db/system.php?table=division").success(function (data) {
                    $scope.system.arrDivision = data;
                    $scope.system.list = data;
                    $scope.system.info = "";

                    // #/1/0/0
                    if ($scope.system.division.id != 0) {
                        setFamily();
                    }
                });
            }
            var setFamily = function () {
                $http.get("db/system.php?table=family&id=" + $scope.system.division.id).success(function (data) {
                    var arr = $scope.system.arrDivision;
                    var id = $scope.system.division.id;
                    var i = 0,
                        l = arr.length;
                    for (i; i < l; i++) {
                        if (arr[i].id === id) {
                            $scope.system.division.title = arr[i].name_cn + arr[i].name_en;
                            $scope.system.info = arr[i].content;
                        }
                    }
                    $scope.system.arrFamily = data;
                    $scope.system.list = data;

                    // #/1/1/0
                    if ($scope.system.family.id != 0) {
                        setGenus();
                    }
                });
            }
            var setGenus = function () {
                $http.get("db/system.php?table=genus&id=" + $scope.system.family.id)
                    .success(function (data) {
                        var arr = $scope.system.arrFamily;
                        var id = $scope.system.family.id;
                        var i = 0;
                        l = arr.length;
                        for (i; i < l; i++) {
                            if (arr[i].id == id) {
                                $scope.system.family.title = arr[i].name_cn + arr[i].name_en;
                                $scope.system.info = arr[i].content;
                            }
                        }
                        $scope.system.arrGenus = data;
                        $scope.system.list = data;

                        // #/1/1/1
                        if ($scope.system.genus.id != 0) {
                            setSpecies();
                        }
                    });
            }
            var setSpecies = function () {
                $http.get("db/system.php?table=species&id=" + $scope.system.genus.id)
                    .success(function (data) {
                        var arr = $scope.system.arrGenus;
                        var id = $scope.system.genus.id;
                        var i = 0;
                        l = arr.length;
                        for (i; i < l; i++) {
                            if (arr[i].id == id) {
                                $scope.system.genus.title = arr[i].name_cn + arr[i].name_en;
                                $scope.system.info = arr[i].content;
                            }
                        }
                        $scope.system.arrSpecies = data;
                        $scope.system.list = data;
                    });
            }
            
//            if($scope.system.curID.d==null){
//                console.log("d is null");
//                $scope.system.curID.d=2;
//            }
            
            setDivision();
//            var curID=$scope.system.curID;
//            var system=$scope.system;
//            console.log("cur:"+$scope.system.curID.d+"&next:"+system.division.id);
//            if(curID.d!=system.division.id){
//                setDivision();
//                $scope.system.curID.d=system.division.id;
//                console.log("from divi-------------");
//            }else if(curID.f!=system.family.id){
//                setFamily();               
//                curID.f=system.family.id;
//                console.log("from fami-------------");
//            }else if(curID.g!=system.genus.id){
//                setGenus();
//                curID.g=system.genus.id;
//                console.log("from genu-------------");
//            }

    }])
    .controller("topicListCtrl", ["$scope", "$http", "$routeParams",
        function ($scope, $http, $routeParams) {
            $scope.topic = {
                topics: [
                    {
                        id: "",
                        title: "",
                        d: ""
                }
            ],
                pages: []
            };
            $http.get("db/pagination.php?table=subject&items=id,title,d&page=" + $routeParams.page)
                .success(function (data) {
                    $scope.topic.topics = data[1];
                    $scope.topic.pages = data[0];
                })
                .error(function (data) {
                    $scope.topic.pages = data;
                });


    }])
    .controller("topicDetailsCtrl", ["$scope", "$routeParams", "$http",
        function ($scope, $routeParams, $http) {
            $scope.topicDetails = {
                title: "",
                d: "",
                s: [
                    {
                        id: "",
                        name_cn: "",
                        name_en: "",
                        img_name: ""
                }
            ]
            };
            $http.get("db/topicDetails.php?id=" + $routeParams.id)
                .success(function (data) {
                    $scope.topicDetails = data;
                });
    }])
    .controller("catalogCtrl", ["$scope","$routeParams","$http",
        function ($scope, $routeParams, $http) {
            $scope.items = [];
            $scope.tmp = [];
            $scope.pages="";
            $http.get("db/pagination.php?table=species&items=id,name_cn,name_en,division,family,genus&page="
                +$routeParams.page).success(function (data) {
                $scope.pages=data[0];
                $scope.items = data[1];
                var i = 0,
                l = data[1].length;
                for (i; i < l; i++) {
                    var d = $scope.items[i].division;
                    var f = $scope.items[i].family;
                    var g = $scope.items[i].genus;
                    (function(d,f,g,i){
                        $http({
                            url: "db/species_class.php",
                            method: "get",
                            params: {
                                division: d,
                                family: f,
                                genus: g
                            }
                        }).success(function (data) {
                            $scope.tmp[i] = data;
                            $scope.items[i].division =
                                data.division;
                            $scope.items[i].family = data.family;
                            $scope.items[i].genus = data.genus;                        
                        })    
                    })(d,f,g,i);
                    
//                    $scope.items[i].division = $scope.tmp.division;
//                    $scope.items[i].family = $scope.tmp.family;
//                    $scope.items[i].genus = $scope.tmp.genus;
                }

            });
    }])
    .controller("knowledgeListCtrl", ["$scope", "$routeParams", "$http",
        function ($scope, $routeParams, $http) {
            $scope.klgList = {
                total: "",
                category: [
                    {
                        id: "",
                        name: "",
                        count: ""
                }
            ],
                articles: [
                    {
                        id: "",
                        title: "",
                        category: ""
                }
            ],
                curCat: "",
                pages: []
            };
            $scope.klgList.curCat = $routeParams.catid;
            $scope.isActive = function (catId) {
                return catId == $routeParams.catid;
            }
            $http.get("db/r.php?tables=klg_category&items=id,name").
            success(function (data) {
                $scope.klgList.category = data;
                var i = 0;
                l = data.length;
                for (i; i < l; i++) {
                    $scope.klgList.category[i].count = 0;
                }

                //用运算来代替增加数据库count项以及一系列逻辑代码                    
                $http.get("db/pagination.php?table=knowledge&items=category&page=" + $routeParams.page).
                success(function (data) {
                    $scope.klgList.total = data[1].length;
                    var arrArt = $scope.klgList.articles = data[1];
                    var arrCat = $scope.klgList.category;
                    var i = 0,
                        l1 = arrArt.length,
                        l2 = arrCat.length;
                    for (i; i < l1; i++) {
                        var j = 0;
                        for (j; j < l2; j++) {
                            if (arrArt[i].category == arrCat[j].id) {
                                //category statics
                                arrCat[j].count++;
                                break;
                            }
                        }
                    }
                });
                var s = "db/pagination.php?table=knowledge&items=id,title,category&catid=" + $routeParams.catid + "&page=" + $routeParams.page;
                if ($routeParams.catid == 0) {
                    s = "db/pagination.php?table=knowledge&items=id,title,category&page=" + $routeParams.page
                }
                $http.get(s).
                success(function (data) {
                    $scope.klgList.pages = data[0];
                    var arrArt = $scope.klgList.articles = data[1];
                    var arrCat = $scope.klgList.category;
                    var i = 0,
                        l1 = arrArt.length,
                        l2 = arrCat.length;
                    for (i; i < l1; i++) {
                        var j = 0;
                        for (j; j < l2; j++) {
                            if (arrArt[i].category == arrCat[j].id) {
                                arrArt[i].category = arrCat[j].name;
                                break;
                            }
                        }
                    }
                });
            });
    }])
    .controller("knowledgeDetailsCtrl", ["$scope", "$routeParams", "$http",
        function ($scope, $routeParams, $http) {
            $scope.klgDetails = {
                title: "",
                content: "",
                date: "",
                category: ""
            };
            $http.get("db/klgDetails.php?id=" + $routeParams.id).
            success(function (data) {
                $scope.klgDetails = data[0];
            });
    }])
    .controller("aboutCtrl", ["$scope", "$routeParams", "$http",
        function ($scope, $routeParams, $http) {
            $scope.about = {};
            if ($routeParams.id == 5) {
                $scope.about.id = 5;
                $http.get("db/r.php?tables=sblog&items=*").
                success(function (data) {
                    $scope.sblog = data.reverse();
                })
            } else {
                $http({
                    url: "db/r.php",
                    method: "get",
                    params: {
                        tables: "intro",
                        items: "id,title,content",
                        id: $routeParams.id
                    }
                }).
                success(function (data) {
                    $scope.about = data[0];
                })
            }
    }])
    .controller("searchCtrl", ["$scope", "$http", "$routeParams",
        function ($scope, $http, $routeParams) {
            $scope.search = {
                result: [],
                total: 0,
                keyword: $routeParams.keyword
            };

            $http.get("db/search.php?keyword=" + $scope.search.keyword)
                .success(function (data) {
                    $scope.search.result = data.reverse();
                    $scope.search.total = data.length;
                });
    }])
    .controller("messagesCtrl", ["$scope",
        function ($scope) {

    }])
    .controller("speciesDetailsCtrl", ["$scope", "$routeParams", "$http",
        function ($scope, $routeParams, $http) {
            $scope.species = {
                name_cn: "",
                name_en: "",
                name_ot: "",
                division: "",
                family: "",
                genus: "",
                distribution: "",

                longitude: "",
                latitude: "",

                morphology: "",
                origin: "",
                habitus: "",
                cultivation: "",
                application: "",
                history: ""

            };
            $http.get("db/r.php?tables= &items=* &id=" + $routeParams.id)
                .success(function (data) {
                    var s = $scope.species = data[0];

                    var imgNames = $scope.species.img_name.split(",");
                    $scope.species.imgSrc = imgNames;

                    var argument = "?division=" + s.division + "&family=" + s.family + "&genus=" + s.genus;
                    $http.get("db/species_class.php" + argument).
                    success(function (data) {
                        $scope.species.division = data['division'];
                        $scope.species.family = data['family'];
                        $scope.species.genus = data['genus'];
                    }).
                    error(function (data) {

                    });


                    var map = new BMap.Map("map");
                    map.addControl(new BMap.MapTypeControl()); //添加地形控制器
                    map.enableScrollWheelZoom(); //设置鼠标滚轮缩放为启用
                    map.centerAndZoom(new BMap.Point(118.105219, 24.443082), 15);

                    var longitudeArr = $scope.species.longitude.split(',');
                    var latitudeArr = $scope.species.latitude.split(',');
                    for (var i = 0; i < longitudeArr.length; i++) {
                        map.addOverlay(new BMap.Marker(new BMap.Point(longitudeArr[i], latitudeArr[i])));
                    }
                })
                .error(function (data) {

                });

    }]);