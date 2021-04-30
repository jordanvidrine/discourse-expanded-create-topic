import Component from "@ember/component";
import { ajax } from "discourse/lib/ajax";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { readOnly } from "@ember/object/computed";

export default Component.extend({
  topicTitle: null,
  router: service(),
  tagName: "div",
  classNames: ["expanded-create-topic-container"],

  init() {
    this._super(...arguments);
  },

  keyUp(e) {
    if (e.which === 13) {
      this.createTopic();
    } else {
      // dont set value of tabbed target
      if (e.which === 9) return false;
      this.set("topicTitle", e.target.value);
    }
  },

  @action
  createTopic() {
    if (this.currentUser) {
      // This is not ideal - we should not be using __container__ here
      // We can't inject it properly, because ember doesn't allow injecting controllers into components
      // We can't `sendAction` up to routes/application createNewTopicViaParams because only clojure actions are allowed
      // We can't use clojure actions because then an openComposer action would have to be passed to every plugin outlet
      // The best solution is probably a core appEvent or service which themes could trigger
      Discourse.__container__.lookup("controller:composer").open({
        action: "createTopic",
        draftKey: "createTopic",
        title: this.topicTitle,
      });
    } else {
      this.router.transitionTo("login");
    }
  },
});
