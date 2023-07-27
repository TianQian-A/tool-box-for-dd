<script setup lang="tsx">
import dayjs from 'dayjs'
import { DataTableColumns, NIcon } from 'naive-ui'
import FluentEmojiFlatOpenFileFolder from '~icons/fluent-emoji-flat/open-file-folder'
import FluentEmojiFlatPageWithCurl from '~icons/fluent-emoji-flat/page-with-curl'

const rootPath = ref('')
const fileArr = ref<DirItem[]>([])
const openFolderDialog = () => {
  window.api['folder:openDialog']().then((res) => {
    rootPath.value = res.rootPath
    fileArr.value = res.dirArr
  })
}

const rowKey = (row: DirItem) => row.id
const rowProps = (row: DirItem) => {
  return {
    style: 'cursor: pointer;',
    onClick: async () => {
      if (!row.isDir) return
      window.api['folder:readDir'](row.path).then((res) => {
        rootPath.value = res.rootPath
        fileArr.value = res.dirArr
      })
    }
  }
}
const columns: DataTableColumns<DirItem> = [
  {
    type: 'selection',
    disabled(row) {
      return !row.isDir
    }
  },
  {
    key: 'name',
    title: '文件名',
    resizable: true,
    ellipsis: {
      tooltip: true
    },
    render(rowData) {
      return (
        <div class="flex items-center text-sm">
          <NIcon size={20} style="transform: translateY(-2px)">
            {rowData.isDir ? (
              <FluentEmojiFlatOpenFileFolder></FluentEmojiFlatOpenFileFolder>
            ) : (
              <FluentEmojiFlatPageWithCurl></FluentEmojiFlatPageWithCurl>
            )}
          </NIcon>
          <span class="ml-2">{rowData.name}</span>
        </div>
      )
    }
  },
  {
    key: 'state',
    title: '最后编辑时间',
    render(rowData) {
      return dayjs(rowData.stat.mtimeMs).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    key: 'state',
    title: '文件大小',
    render(rowData) {
      return rowData.isDir ? '-' : Math.round(rowData.stat.size / 1000) + ' KB'
    }
  }
]
</script>
<template>
  <div class="w-full h-full flex-col">
    <template v-if="!rootPath">
      <div class="w-full h-full flex-center">
        <NButton type="primary" @click="openFolderDialog">选择工作目录</NButton>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col">
        <div class="operate-box mb-2">
          <div class="space-x-2">
            <NButton circle>
              <template #icon>
                <IUilAngleLeftB></IUilAngleLeftB>
              </template>
            </NButton>
            <NButton circle>
              <template #icon>
                <IUilAngleRightB></IUilAngleRightB>
              </template>
            </NButton>
            <NButton circle secondary type="primary" class="text-green-200">
              <template #icon>
                <IUilRefresh></IUilRefresh>
              </template>
            </NButton>
          </div>
        </div>
        <NDataTable
          :data="fileArr"
          :columns="columns"
          :row-key="rowKey"
          :row-props="rowProps"
          min-height="60vh"
          max-height="60vh"
        ></NDataTable>
      </div>
    </template>
  </div>
</template>
<style scoped lang="scss"></style>
