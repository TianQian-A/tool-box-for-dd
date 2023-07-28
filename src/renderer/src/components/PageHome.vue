<script setup lang="tsx">
import dayjs from 'dayjs'
import { DataTableColumns, NDivider, NEllipsis, NIcon, NTooltip } from 'naive-ui'
import FluentEmojiFlatOpenFileFolder from '~icons/fluent-emoji-flat/open-file-folder'
import FluentEmojiFlatPageWithCurl from '~icons/fluent-emoji-flat/page-with-curl'

const message = useMessage()
const baseStore = useStoreBase()

const rootPath = ref('')
const fileArr = ref<DirItem[]>([])
const folderLoading = ref(false)
const toggleFolderLoading = useToggle(folderLoading)
const autoCategoryEnable = ref(false)
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

const rowKey = (row: DirItem) => row.id
const rowProps = (row: DirItem) => {
  return {
    style: 'cursor: pointer;',
    onClick: async () => {
      if (!row.isDir) return
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
  <div class="w-full h-full flex-col flex">
    <template v-if="!rootPath">
      <div class="w-full h-full flex-center flex-col space-y-2">
        <NButton type="primary" @click="openFolderDialog">选择工作目录</NButton>
        <NList hoverable clickable>
          <NListItem
            v-for="path in baseStore.openedRootPaths"
            :key="path"
            @click="toFolder(path)"
            >{{ path }}</NListItem
          >
        </NList>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center space-x-2">
        <NTooltip trigger="hover" :show-arrow="false">
          <template #trigger>
            <NButton
              circle
              tertiary
              :secondary="autoCategoryEnable"
              type="info"
              @click="autoCategoryEnable = !autoCategoryEnable"
            >
              <template #icon>
                <IUilIcons></IUilIcons>
              </template>
            </NButton>
          </template>
          快速分类
        </NTooltip>
        <NDivider vertical></NDivider>
        <NTooltip trigger="hover" :show-arrow="false">
          <template #trigger>
            <NButton circle tertiary type="warning" @click="openFolderDialog">
              <template #icon>
                <IUilBringBottom></IUilBringBottom>
              </template>
            </NButton>
          </template>
          重新选择目录
        </NTooltip>
        <NTooltip trigger="hover" :show-arrow="false">
          <template #trigger>
            <NButton circle tertiary type="primary" @click="toFolder(rootPath)">
              <template #icon>
                <IUilRefresh></IUilRefresh>
              </template>
            </NButton>
          </template>
          刷新目录
        </NTooltip>
      </div>
      <NBreadcrumb separator=">" class="my-2">
        <NBreadcrumbItem
          v-for="item in rootPathBreadCrumb"
          :key="item.path"
          @click="toFolder(item.path)"
          >{{ item.name }}</NBreadcrumbItem
        >
      </NBreadcrumb>
      <NDataTable
        class="flex-1"
        flex-height
        :data="fileArr"
        :columns="columns"
        :row-key="rowKey"
        :row-props="rowProps"
        :loading="folderLoading"
      ></NDataTable>
    </template>
  </div>
</template>
<style scoped lang="scss"></style>
