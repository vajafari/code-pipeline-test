import { assign, pick, remove } from "lodash"
import * as React from "react"
import { useUnmount, useUpdate } from "react-use"

interface localStorageConfig<store> {
  label: string
  keysToPersist: (keyof store)[]
}

type setUseStore = <store>(
  store: store,
  localStorageConfig?: localStorageConfig<store>,
) => {
  useStore: () => store
  updateListeners: () => void
}

const setLocalStorage = (store: any, localStorageConfig: localStorageConfig<any>) => {
  const savedStore = pick(store, localStorageConfig.keysToPersist)
  localStorage.setItem(localStorageConfig.label, JSON.stringify(savedStore))
}

const getLocalStorage = (store: any, localStorageConfig: localStorageConfig<any>) => {
  const savedStoreRaw = localStorage.getItem(localStorageConfig.label)
  if (savedStoreRaw) {
    const savedStore = JSON.parse(savedStoreRaw)
    assign(store, savedStore)
  }
}

export const setUseStore = <store>(store: store, localStorageConfig?: localStorageConfig<store>) => {
  const listeners: any[] = []
  function updateListeners() {
    for (const listener of listeners) listener()
    if (process.env.IS_BROWSER && localStorageConfig) {
      setLocalStorage(store, localStorageConfig)
    }
  }
  if (process.env.IS_BROWSER && localStorageConfig) {
    getLocalStorage(store, localStorageConfig)
  }
  function useStore() {
    const refAdded = React.useRef<boolean>()
    const updateListener = useUpdate()
    if (!refAdded.current) {
      refAdded.current = true
      listeners.push(updateListener)
    }
    useUnmount(() => {
      remove(listeners, (listener) => listener === updateListener)
    })
    return store
  }
  return { useStore, updateListeners }
}

export const cleanObjKeys = (obj: any) => {
  for (const key of Object.keys(obj)) delete obj[key]
}

export const setPropsAssign = <I, P>(initialStore: I, props: P): void => {
  cleanObjKeys(initialStore)
  Object.assign(initialStore, props)
}
