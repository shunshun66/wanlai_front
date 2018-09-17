export default {
  advertimg: {
    breadcrumb: {
      home:              '首页',
      current:          '广告图片管理'
    },
    model: {
      imgName:          '图片名称',
      imgUrl:           '图片URL',
      positionType:    '布局类型',
      imgType:          '图片类型',
      imgIndex:         '图片序号',
      linkUrl:          '广告连接'
    },
    create: {
      title:            '创建广告图片',
      modifytitle:     '修改广告图片',
      selectImage:      '选择图片'
    },
    operation: {
    },
    rules: {
      imgName:          '请输入图片名称',
      imgUrl:           '请选择图片',
      imgIndex:         '图片序号'
    },
    action: {
      advertExisted:  '该广告图片名称已经存在'
    }
  }
}
