import { defineStore } from 'pinia'

const state = {
  visitedViews: [],
  cachedViews: []
}

const mutations = {
  ADD_VISITED_VIEW: function(view) {
    if (this.visitedViews.some((v) => v.path === view.path)) return
    this.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  },
  ADD_CACHED_VIEW: function(view) {
    if (this.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      this.cachedViews.push(view.name)
    }
  },

  DEL_VISITED_VIEW: function(view) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: function(view) {
    const index = this.cachedViews.indexOf(view.name)
    index > -1 && this.cachedViews.splice(index, 1)
  },

  DEL_OTHERS_VISITED_VIEWS: function(view) {
    this.visitedViews = this.visitedViews.filter((v) => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: function(view) {
    if (this.cachedViews.length > 0) {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) {
        this.cachedViews = this.cachedViews.slice(index, index + 1)
      } else {
        // if index = -1, there is no cached tags
        this.cachedViews = []
      }
    }
  },

  DEL_ALL_VISITED_VIEWS: function() {
    // keep affix tags
    const affixTags = this.visitedViews.filter((tag) => tag.meta.affix)
    this.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: function() {
    this.cachedViews = []
  },

  UPDATE_VISITED_VIEW: function(view) {
    for (let v of this.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  async addView(view) {
    await this.addVisitedView(view)
    await this.addCachedView(view)
  },
  addVisitedView(view) {
    this.ADD_VISITED_VIEW(view)
  },
  addCachedView(view) {
    this.ADD_CACHED_VIEW(view)
  },

  delView(view) {
    return new Promise(async (resolve) => {
      await delVisitedView(view)
      await delCachedView(view)
      resolve({
        visitedViews: [...this.visitedViews],
        cachedViews: [...this.cachedViews]
      })
    })
  },
  delVisitedView(view) {
    return new Promise((resolve) => {
      this.DEL_VISITED_VIEW(view)
      resolve([...this.visitedViews])
    })
  },
  delCachedView(view) {
    return new Promise((resolve) => {
      this.DEL_CACHED_VIEW(view)
      resolve([...this.cachedViews])
    })
  },

  delOthersViews(view) {
    return new Promise(async (resolve) => {
      await this.delOthersVisitedViews(view)
      await this.delOthersCachedViews(view)
      resolve({
        visitedViews: [...this.visitedViews],
        cachedViews: [...this.cachedViews]
      })
    })
  },
  delOthersVisitedViews(view) {
    return new Promise((resolve) => {
      this.DEL_OTHERS_VISITED_VIEWS(view)
      resolve([...this.visitedViews])
    })
  },
  delOthersCachedViews(view) {
    return new Promise((resolve) => {
      this.DEL_OTHERS_CACHED_VIEWS(view)
      resolve([...this.cachedViews])
    })
  },

  delAllViews(view) {
    return new Promise(async (resolve) => {
      await this.delAllVisitedViews(view)
      await this.delAllCachedViews(view)
      resolve({
        visitedViews: [...this.visitedViews],
        cachedViews: [...this.cachedViews]
      })
    })
  },
  delAllVisitedViews() {
    return new Promise((resolve) => {
      this.DEL_ALL_VISITED_VIEWS()
      resolve([...this.visitedViews])
    })
  },
  delAllCachedViews() {
    return new Promise((resolve) => {
      this.DEL_ALL_CACHED_VIEWS()
      resolve([...this.cachedViews])
    })
  },

  updateVisitedView(view) {
    this.UPDATE_VISITED_VIEW(view)
  }
}

const useTagsViewStore = defineStore('tagsViewStore', {
  state: () => state,
  getters: {
    getVisitedViews: (state) => state.visitedViews,
    getCachedViews: (state) => state.cachedViews
  },
  actions: {
    ...mutations,
    ...actions
  }
})

export { useTagsViewStore }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
