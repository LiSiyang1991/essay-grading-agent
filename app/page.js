"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [essay, setEssay] = useState("");
  const [grade, setGrade] = useState(null);

  async function handleGrade() {
    const response = await fetch("/api/grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ essay })
    });

    const data = await response.json();
    setGrade(data);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Essay Grader v1</h1>

        <p className={styles.description}>
          请粘贴一篇作文，然后点击按钮进行评分。
        </p>

        <textarea
          className={styles.textarea}
          placeholder="请在这里粘贴作文内容..."
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
        />

        <button className={styles.button} onClick={handleGrade}>
          开始评分
        </button>

        <p>当前字数: {essay.length}</p>

        {grade && (
          <section className={styles.gradeCard}>
            <h2>评分结果</h2>
            <p>总分: {grade.overallScore}</p>
            <p>反馈: {grade.feedback}</p>
          </section>
        )}

      </main>
    </div>
  );
}
