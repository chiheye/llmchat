import { createEmbedding } from "../lib/db/vector-operations.js"

async function testEmbedding() {
  try {
    const embedding = await createEmbedding("Hello, world!")
    console.log("Embedding:", embedding)
  } catch (error) {
    console.error("Error:", error)
  }
}

testEmbedding() 