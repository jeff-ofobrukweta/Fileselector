import { mount } from "@vue/test-utils";
import HomeComponent from "../../src/App.vue";
import { axiosGet } from "@/utils/api";

describe("app.vue", () => {
  it("testing for inner text on the button", () => {
    const msg = "Select Files";
    const wrapper = mount(HomeComponent, {});
    const btn = wrapper.find("button.btn.select-btn");

    // making sure the btn text match the expected string
    expect(btn.text()).toMatch(msg);

    // making sure the modal is closed before clicking the button
    expect(wrapper.vm.$children[1].isModalOpen).toBe(false);
    btn.trigger("click");

    // making sure the modal is open after clicking the button
    expect(wrapper.vm.$children[1].isModalOpen).toBe(true);
    wrapper.vm.$forceUpdate();

    // checking the inner modal btn text to see if it matched expected string
    const innerModalBtnText = wrapper.find(".btn");
    expect(innerModalBtnText.text()).toMatch(msg);
  });
});

describe("api tests", () => {
  it("testing for api types", async () => {
    const apiData = await axiosGet();
    // checking if the response from the api is an object
    expect(typeof apiData).toBe("object");

    // checkng if the folders property of the api obj is an an array
    expect(Array.isArray(apiData.folders)).toBe(true);

    // checkng if the files property of the api obj is an an array
    expect(Array.isArray(apiData.files)).toBe(true);
  });
});
