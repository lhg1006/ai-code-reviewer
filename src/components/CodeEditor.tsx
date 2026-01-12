'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { ProgrammingLanguage, languageLabels } from '@/types/review';

interface CodeEditorProps {
  onReview: (code: string, language: ProgrammingLanguage) => void;
  isLoading: boolean;
  disabled: boolean;
}

const languages: ProgrammingLanguage[] = [
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'rust',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'swift',
  'kotlin',
];

const sampleCode: Record<ProgrammingLanguage, string> = {
  javascript: `function fetchUserData(userId) {
  var data = null;
  fetch('/api/users/' + userId)
    .then(res => res.json())
    .then(json => {
      data = json;
    });
  return data;
}

function processItems(items) {
  for (var i = 0; i <= items.length; i++) {
    console.log(items[i].name);
  }
}`,
  typescript: `interface User {
  id: number;
  name: string;
}

async function getUser(id: any): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

function findUser(users: User[], name: string) {
  for (let i = 0; i <= users.length; i++) {
    if (users[i].name == name) {
      return users[i];
    }
  }
}`,
  python: `def process_data(data):
    result = []
    for i in range(len(data)):
        item = data[i]
        if item != None:
            result.append(item * 2)
    return result

def read_file(filename):
    f = open(filename, 'r')
    content = f.read()
    return content

password = "admin123"`,
  java: `public class UserService {
    public User findUser(List<User> users, String name) {
        for (int i = 0; i <= users.size(); i++) {
            if (users.get(i).getName() == name) {
                return users.get(i);
            }
        }
        return null;
    }

    public void processData(String input) {
        String query = "SELECT * FROM users WHERE name = '" + input + "'";
        // execute query
    }
}`,
  go: `package main

func processItems(items []string) {
    for i := 0; i <= len(items); i++ {
        fmt.Println(items[i])
    }
}

func readConfig() string {
    password := "secret123"
    return password
}`,
  rust: `fn process_vector(v: &Vec<i32>) -> i32 {
    let mut sum = 0;
    for i in 0..=v.len() {
        sum += v[i];
    }
    sum
}

fn get_user_input() -> String {
    let input = String::new();
    input
}`,
  cpp: `#include <vector>

void processArray(int* arr, int size) {
    for (int i = 0; i <= size; i++) {
        std::cout << arr[i] << std::endl;
    }
}

char* getName() {
    char name[100];
    strcpy(name, "test");
    return name;
}`,
  csharp: `public class DataProcessor {
    public void ProcessList(List<int> items) {
        for (int i = 0; i <= items.Count; i++) {
            Console.WriteLine(items[i]);
        }
    }

    public string GetQuery(string userInput) {
        return "SELECT * FROM users WHERE name = '" + userInput + "'";
    }
}`,
  php: `<?php
function getUser($id) {
    $query = "SELECT * FROM users WHERE id = " . $id;
    $result = mysql_query($query);
    return $result;
}

function processData($data) {
    for ($i = 0; $i <= count($data); $i++) {
        echo $data[$i];
    }
}
?>`,
  ruby: `def process_items(items)
  for i in 0..items.length
    puts items[i]
  end
end

def execute_command(user_input)
  system("ls " + user_input)
end`,
  swift: `func processArray(_ arr: [Int]) -> Int {
    var sum = 0
    for i in 0...arr.count {
        sum += arr[i]
    }
    return sum
}

func loadData() -> String? {
    let data: String! = nil
    return data
}`,
  kotlin: `fun processItems(items: List<String>) {
    for (i in 0..items.size) {
        println(items[i])
    }
}

fun executeQuery(userInput: String): String {
    return "SELECT * FROM users WHERE name = '$userInput'"
}`,
};

export default function CodeEditor({ onReview, isLoading, disabled }: CodeEditorProps) {
  const [code, setCode] = useState(sampleCode.javascript);
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript');

  const handleLanguageChange = (lang: ProgrammingLanguage) => {
    setLanguage(lang);
    setCode(sampleCode[lang]);
  };

  const handleReview = () => {
    if (code.trim()) {
      onReview(code, language);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">언어:</label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as ProgrammingLanguage)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {languageLabels[lang]}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          onClick={handleReview}
          disabled={!code.trim() || isLoading || disabled}
          whileHover={!isLoading && !disabled ? { scale: 1.02 } : {}}
          whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              리뷰 중...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              코드 리뷰
            </>
          )}
        </motion.button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language === 'csharp' ? 'csharp' : language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>

      {disabled && (
        <div className="border-t border-gray-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-700 dark:border-gray-700 dark:bg-amber-900/20 dark:text-amber-400">
          API 키를 먼저 설정해주세요
        </div>
      )}
    </div>
  );
}
