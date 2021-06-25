// 频道请求模块

import request from '@/utils/request'

// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    url: '/app/v1_0/channels',
    method: 'GET'
  })
}

// 添加用户频道
export const addUserChannel = channels => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels: [channels]
    }
  })
}

// 添加指定用户频道
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`

  })
}
