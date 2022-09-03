import { assertEquals } from "./test_deps.ts";
import * as mod from "../mod.ts";

Deno.test("Public API Assertions", () => {
  assertEquals(mod != null, true);
  assertEquals(typeof mod.Encoder === "function", true);
  assertEquals(typeof mod.Encrypter === "function", true);
  assertEquals(typeof mod.ObjectId64 === "function", true);
  assertEquals(mod.ObjectId64 === mod.Encoder, true);
});
