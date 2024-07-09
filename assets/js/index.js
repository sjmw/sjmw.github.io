var totalImage = 0;

/**
 * 发送请求
 * @param url
 * @returns
 */
async function sentRequest(url) {
    return $.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON'
    });
}

/**
 * 生成随机ID
 * @returns {string}
 */
function generateId() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp}${randomNum}`;
}

/**
 * 创建侧边栏导航
 * @param category 父菜单详情
 * @param categoryDetail 子菜单详情
 * @returns {{subId: {}, sidebarItemStr: string}}
 */
function createSidebarNavItem(category, categoryDetail) {
    const TEMPLATE_SIDEBAR_ITEM_STR = '    <li class="sidebar-item">\n' +
        '        <a href="#@CATEGORYID@" class="smooth change-href"\n' +
        '           data-change="#@CATEGORYID@">\n' +
        '            <i class="@ICON@ icon-fw icon-lg mr-2"></i>\n' +
        '            <span>@CATEGORYNAME@</span>\n' +
        '            <i class="iconfont icon-arrow-r-m sidebar-more text-sm"></i>\n' +
        '        </a>\n' +
        '        <ul>\n' +
        '            @SUBUL@\n' +
        '        </ul>\n' +
        '    </li>\n';

    const SUB_LI_STR = '    <li>\n' +
        '        <a href="#@SUBID@" class="smooth">\n' +
        '        <span>@SUBNAME@</span>\n' +
        '        </a>\n' +
        '    </li>';

    let liList = '';
    let categoryId = generateId();
    let subCategoryArr = categoryDetail?.categoryDetail || [];

    let subIds = {};
    let hasChildren = category?.mulCategory === 'true';
    subCategoryArr.forEach((item, index) => {
        let subId = categoryId
        if (index !== 0) {
            subId = generateId();
        }
        subIds[item.subId] = subId;
        if (item.subName !== undefined && item.subName !== '') {
            liList += SUB_LI_STR.replaceAll("@SUBID@", subId).replaceAll("@SUBNAME@", item.subName);
        }
    })

    let iconClass = category?.iconClass || 'fas fa-coffee'
    return {
        'sidebarItemStr': TEMPLATE_SIDEBAR_ITEM_STR.replaceAll("@CATEGORYID@", categoryId)
            .replaceAll("@ICON@", iconClass)
            .replaceAll("@CATEGORYNAME@", category.name)
            .replaceAll("@SUBUL@", liList),
        'subId': subIds
    }
}

/**
 * 获取默认图片
 * @param totalImage 图片数量,放在assets/image/nav下面
 */
function getDefaultImage() {
    if (totalImage <= 0) {
        return 'assets/images/nav/bg-1.jpg';
    }
    let min = 1;
    let randomInt = Math.floor(Math.random() * (totalImage - min) + min);
    return 'assets/images/nav/bg-' + randomInt + '.jpg';
}

/**
 * 创建导航栏
 * @param idConfig
 * @param category
 * @param subCategoryDetail
 * @returns {string}
 */
function createNavRow(idConfig, category, subCategoryDetail) {
    let navStr = '';
    let NAV_ROW_TEMPLATE_STR =
        '<div class="d-flex flex-fill">\n' +
        '    <h4 class="text-gray text-lg mb-4">\n' +
        '        <i class="site-tag iconfont icon-tag icon-lg mr-1" id="@SUBID@"></i>\n' +
        '        @SUBNAME@\n' +
        '    </h4>\n' +
        '    <div class="flex-fill"></div>\n' +
        '</div>\n' +
        '<div class="row">\n' +
        '    @ROWITEM@\n' +
        '</div>\n' +
        '<br/>';

    navStr = NAV_ROW_TEMPLATE_STR.replaceAll("@SUBNAME@", subCategoryDetail.subName)
        .replaceAll("@SUBID@", idConfig[subCategoryDetail.subId])

    let rowItemStr = '';
    let ROW_ITEM_TEMPLATE_STR = '<div class="url-card col-6  col-sm-6 col-md-4 col-xl-5a col-xxl-6a">\n' +
        '    <div class="url-body default">\n' +
        '        <a href="@NAVURL@" target="_blank" data-id="" data-url="@NAVURL@"\n' +
        '           class="card no-c mb-4" data-toggle="tooltip" data-placement="bottom"\n' +
        '           data-original-title="@NAVDESC@">\n' +
        '            <div class="card-body">\n' +
        '                <div class="url-content d-flex align-items-center">\n' +
        '                    <div class="url-img mr-2 d-flex align-items-center justify-content-center">\n' +
        '                        <img class="lazy"\n' +
        '                             src="@NAVLOGO@"\n' +
        '                             data-src="@NAVLOGO@"\n' +
        '                             onError="javascript:this.src=\'@DEFAULTLOGO@\'"\n' +
        '                             alt="@NAVNAME@"/>\n' +
        '                    </div>\n' +
        '                    <div class="url-info flex-fill">\n' +
        '                        <div class="text-sm overflowClip_1">\n' +
        '                            <strong>@NAVNAME@</strong>\n' +
        '                        </div>\n' +
        '                        <p class="overflowClip_1 m-0 text-muted text-xs">@NAVDESC@</p>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </a>\n' +
        '        <a href="@NAVURL@" class="togo text-center text-muted is-views" data-id="689"\n' +
        '           data-toggle="tooltip" data-placement="right" title="直达" rel="nofollow">\n' +
        '            <i class="iconfont icon-goto"></i>\n' +
        '        </a>\n' +
        '    </div>\n' +
        '</div>';

    let navList = subCategoryDetail?.navList || [];
    navList.forEach((item, index) => {
        let defaultImagePath = getDefaultImage(); // 获取默认图片
        let hasImagePath = item.navLogo !== undefined && item.navLogo !== '';

        let navItemStr = ROW_ITEM_TEMPLATE_STR.replaceAll("@NAVDESC@", item.navDesc)
            .replaceAll("@NAVLOGO@", hasImagePath ? item.navLogo : defaultImagePath)
            .replaceAll("@NAVURL@", item.navUrl)
            .replaceAll("@DEFAULTLOGO@", defaultImagePath)
            .replaceAll("@NAVNAME@", item.navName);
        rowItemStr += navItemStr;
    })

    return navStr.replaceAll("@ROWITEM@", rowItemStr)
}

function createNavRows(idConfig, category, subCategoryDetails) {
    let navStr = "";
    if (subCategoryDetails !== undefined) {
        subCategoryDetails.forEach((item) => {
            navStr += createNavRow(idConfig, category, item)
        })
    }

    return navStr;
}

async function handlerSubCategory(category) {
    let url = './assets/data/' + category.subName + '.json';
    let sidebarStr = '';
    let navRowStr = '';
    let subCategoryDetail = await sentRequest(url);
    let categoryItem = createSidebarNavItem(category, subCategoryDetail);
    sidebarStr += categoryItem?.sidebarItemStr || '';
    let idConfig = categoryItem?.subId || {};
    navRowStr += createNavRows(idConfig, category, subCategoryDetail?.categoryDetail || [])

    return {
        "sidebarStr": sidebarStr,
        "navRowStr": navRowStr
    };
}

async function buildCategory() {
    let categoryUrl = './assets/data/category.json';
    let sidebarStr = '';
    let navRowStr = '';
    let friendLinkStr = '';
    try {
        let categories = await sentRequest(categoryUrl);
        let categoryArr = categories?.categories || [];
        totalImage = Number.parseInt(categories?.image?.total || 1);
        // 使用 Promise.all 等待所有 handlerSubCategory 完成
        await Promise.all(categoryArr.map(async category => {
            let data = await handlerSubCategory(category);
            sidebarStr += data?.sidebarStr;
            navRowStr += data?.navRowStr;
        }));

        await buildFriendLink().then(function (data) {
            friendLinkStr = data;
        })
    } catch (error) {
        console.error(error)
    }

    return {
        "sidebarStr": sidebarStr,
        "navRowStr": navRowStr,
        "friendLinkStr": friendLinkStr
    }
}

/**
 * 重新添加事件,菜单的添加在dom初始化之后
 */
function reAddEvent() {
    $(document).on('click', 'a.smooth', function (ev) {
        if ($('#sidebar').hasClass('show') && !$(this).hasClass('change-href')) {
            $('#sidebar').modal('toggle');
        }
        if ($(this).attr("href").substr(0, 1) == "#") {
            $("html, body").animate({
                scrollTop: $($(this).attr("href")).offset().top - 90
            }, {
                duration: 500,
                easing: "swing"
            });
        }
        if ($(this).hasClass('go-search-btn')) {
            $('#search-text').focus();
        }
        if (!$(this).hasClass('change-href')) {
            var menu = $("a" + $(this).attr("href"));
            menu.click();
            toTarget(menu.parent().parent(), true, true);
        }
    });
    $(document).on('click', 'a.tab-noajax', function (ev) {
        var url = $(this).data('link');
        if (url)
            $(this).parents('.d-flex.flex-fill.flex-tab').children('.btn-move.tab-move').show().attr('href', url);
        else
            $(this).parents('.d-flex.flex-fill.flex-tab').children('.btn-move.tab-move').hide();
    });
    // sidebar-menu-inner收缩展开
    $('.sidebar-menu-inner a').on('click', function () {//.sidebar-menu-inner a //.has-sub a
        if (!$('.sidebar-nav').hasClass('mini-sidebar')) {//菜单栏没有最小化
            $(this).parent("li").siblings("li.sidebar-item").children('ul').slideUp(200);
            if ($(this).next().css('display') == "none") { //展开
                //展开未展开
                // $('.sidebar-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(200);
                $(this).parent('li').addClass('sidebar-show').siblings('li').removeClass('sidebar-show');
            } else { //收缩
                //收缩已展开
                $(this).next('ul').slideUp(200);
                //$('.sidebar-item.sidebar-show').removeClass('sidebar-show');
                $(this).parent('li').removeClass('sidebar-show');
            }
        }
    });
    $('[data-toggle="tooltip"]').each(function (i, el) {
        var $this = $(el),
            placement = attrDefault($this, 'placement', 'top'),
            trigger = attrDefault($this, 'trigger', 'hover'),
            tooltip_class = $this.get(0).className.match(/(tooltip-[a-z0-9]+)/i);
        $this.tooltip({
            placement: placement,
            trigger: trigger
        });
        if (tooltip_class) {
            $this.removeClass(tooltip_class[1]);
            $this.on('show.bs.tooltip', function (ev) {
                setTimeout(function () {
                    var $tooltip = $this.next();
                    $tooltip.addClass(tooltip_class[1]);
                }, 0);
            });
        }
    });
}

/**
 * 构建友链
 * @returns {Promise<string>}
 */
async function buildFriendLink() {
    let friendLinkUrl = './assets/data/friendLink.json';
    let friendLinkStr = '';
    let result = await sentRequest(friendLinkUrl);
    const FRIEND_LINK_TEMPLATE_STR = '<a href="@URL@" title="@DESC@" target="_blank">@NAME@</a>'
    let friendLinkArr = result?.friendLink || [];
    friendLinkArr.forEach((friendLink) => {
        friendLinkStr += FRIEND_LINK_TEMPLATE_STR.replaceAll("@URL@", friendLink.url)
            .replaceAll("@DESC@", friendLink.desc)
            .replaceAll("@NAME@", friendLink.name);
    })

    return friendLinkStr;
}



