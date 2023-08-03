<script setup lang="tsx">
import dayjs from 'dayjs'
import { DataTableColumns, NEllipsis, NIcon } from 'naive-ui'
import FluentEmojiFlatOpenFileFolder from '~icons/fluent-emoji-flat/open-file-folder'
import FluentEmojiFlatPageWithCurl from '~icons/fluent-emoji-flat/page-with-curl'

const message = useMessage()
const baseStore = useStoreBase()
const explorerStore = useStoreExplorer()

const rootPath = ref('')
const fileArr = ref<DirItem[]>([])
const folderLoading = ref(false)
const toggleFolderLoading = useToggle(folderLoading)
/**
 * 打开文件对话框
 */
const openFolderDialog = () => {
  toggleFolderLoading(true)
  window.api['folder:openDialog']()
    .then((res) => {
      rootPath.value = res.rootPath
      fileArr.value = res.dirArr
      baseStore.addOpenedRootPath(res.rootPath)
    })
    .catch((err) => {
      if (!err.message.includes('cancel')) {
        message.error(err.message)
      }
    })
    .finally(() => {
      toggleFolderLoading(false)
    })
}
/**
 * 前往目录
 * @param path 目录地址
 */
const toFolder = (path: string) => {
  toggleFolderLoading(true)
  window.api['folder:readDir'](path)
    .then((res) => {
      rootPath.value = res.rootPath
      fileArr.value = res.dirArr
    })
    .catch((err) => {
      message.error(err.message)
    })
    .finally(() => {
      toggleFolderLoading(false)
    })
}
/**
 * 目录面包屑导航
 */
const rootPathBreadCrumb = computed(() => {
  let tempRootPath = ''
  return rootPath.value
    .split('\\')
    .filter(Boolean)
    .map((item) => {
      tempRootPath += `${item}\\`
      return {
        name: item,
        path: tempRootPath
      }
    })
})

const rowKey = (row: DirItem) => row.path
const rowProps = (row: DirItem) => {
  return {
    style: 'cursor: pointer;',
    onClick: async (e: Event) => {
      const isSelection = Array.from((e.target as HTMLDivElement).classList).some(
        (item) => item === 'n-data-table-td--selection' || item === 'n-checkbox-box__border'
      )
      if (isSelection || !row.isDir) return
      toFolder(row.path)
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
    minWidth: 200,
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
          <NEllipsis class="max-w-xs">{rowData.name}</NEllipsis>
        </div>
      )
    }
  },
  {
    key: 'state',
    title: '最后修改时间',
    ellipsis: {
      tooltip: true
    },
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
  <template v-if="!rootPath">
    <div class="w-full h-full flex-center flex-col space-y-10">
      <img src="../assets/imgs/128.png" alt="" />
      <NButton type="primary" @click="openFolderDialog">选择工作目录</NButton>
      <NList hoverable clickable>
        <NListItem v-for="path in baseStore.openedRootPaths" :key="path" @click="toFolder(path)">{{
          path
        }}</NListItem>
      </NList>
    </div>
  </template>
  <template v-else>
    <div class="flex flex-col w-full h-full">
      <WindowExplorerActions @open-dialog="openFolderDialog" @refresh-folder="toFolder(rootPath)">
        <slot name="action"></slot>
      </WindowExplorerActions>
      <NBreadcrumb separator=">" class="my-2">
        <NBreadcrumbItem
          v-for="item in rootPathBreadCrumb"
          :key="item.path"
          @click="toFolder(item.path)"
          >{{ item.name }}</NBreadcrumbItem
        >
      </NBreadcrumb>
      <NDataTable
        v-model:checked-row-keys="explorerStore.checkedPaths"
        flex-height
        :data="fileArr"
        :columns="columns"
        :row-key="rowKey"
        :row-props="rowProps"
        :loading="folderLoading"
        class="flex-1"
      ></NDataTable>
    </div>
  </template>
</template>
<style scoped lang="scss"></style>
