import React from "react";

export default function IntroJavaContent() {
  const html = `
<p><span class="hl-keyword">Java</span> is a high-level, robust, object-oriented, secure programming language developed by <span class="hl-term">Sun Microsystems</span> (1995).</p>
        <p>It is <span class="hl-keyword">platform-independent</span> â€” compiled to <span class="hl-code">bytecode</span> run on <span class="hl-term">JVM</span>.</p>
        <p>Syntax similar to C/C++ but <span class="hl-keyword">no pointers</span>; not pure OOP due to primitive types.</p>
        <p><span class="hl-term">Platform</span> = runtime environment (JRE) + API.</p>
      

        <p>Developed by <span class="hl-term">James Gosling</span> (Sun â†’ Oracle).</p>
        <p>Combines <span class="hl-keyword">C</span> format + <span class="hl-keyword">C++</span> OOP features.</p>
        <p><span class="hl-term">WORA</span> (Write Once, Run Anywhere) â€” no recompilation across platforms.</p>
        <p><span class="hl-code">JVM</span> executes bytecode; JVM itself is <span class="hl-keyword">platform-specific</span> (C/C++/ASM).</p>
      

        <p>Created by <span class="hl-term">Gosling, Naughton, Sheridan</span> at Sun in <span class="hl-keyword">1991</span> (18 months).</p>
        <p>Originally called <span class="hl-code">Oak</span> â†’ renamed <span class="hl-keyword">Java</span> in 1995 (trademark conflict).</p>
        <p>Designed for <span class="hl-term">interactive TV</span> but found success on the <span class="hl-keyword">internet</span>.</p>
        <p>Goal: <span class="hl-term">"Simple, Robust, Portable, Secure, High Performance, Multithreaded"</span>.</p>
      

        <p><span class="hl-keyword">JDK 1.0</span> (1996) â†’ <span class="hl-term">J2SE 5.0</span> (2004) â†’ <span class="hl-keyword">Java SE 8</span> (2014) â†’ <span class="hl-term">Java SE 17</span> (2021).</p>
        <p>Major releases: <span class="hl-code">Java 11</span> (LTS), <span class="hl-code">Java 17</span> (LTS).</p>
        <p>Current stable: <span class="hl-keyword">Java SE 18</span> (March 2022).</p>
        <p>Evolution: <span class="hl-term">JDK â†’ J2SE â†’ Java SE</span>.</p>
      

        <p>First Java app: <span class="hl-term">HotJava</span> browser; applets run in browsers.</p>
        <p>Used for <span class="hl-keyword">JSP</span> (dynamic web pages), <span class="hl-keyword">Applets</span>, <span class="hl-keyword">J2EE</span> (enterprise), <span class="hl-keyword">JavaBeans</span> (reusable components).</p>
        <p>Widely used in <span class="hl-term">mobile</span> (games, apps) and Android development.</p>
        <p><span class="hl-keyword">3 billion</span> devices run Java (Sun).</p>
      

        <p><span class="hl-keyword">Web</span> â€” server-side (Servlet, JSP, Struts, JSF).</p>
        <p><span class="hl-keyword">Standalone</span> â€” desktop (AWT, Swing) e.g. media player, antivirus.</p>
        <p><span class="hl-keyword">Enterprise</span> â€” distributed, high-security, load-balancing (EJB).</p>
        <p><span class="hl-keyword">Mobile</span> â€” Java ME, Android (Google).</p>
      

        <p><span class="hl-term">Object-Oriented</span> â€” simple object model.</p>
        <p><span class="hl-keyword">Platform Independent</span> â€” bytecode runs anywhere.</p>
        <p><span class="hl-term">Secure</span> â€” virus/malware protection.</p>
        <p><span class="hl-keyword">Robust</span> â€” early error detection.</p>
        <p><span class="hl-term">Multi-threaded</span> â€” concurrent tasks.</p>
        <p><span class="hl-keyword">Distributed</span> â€” TCP/IP protocol support.</p>
      

        <p><span class="hl-keyword">JDK</span> = Java Development Kit â€” physically exists.</p>
        <p>Includes: <span class="hl-term">JRE</span> + <span class="hl-code">javac</span> (compiler) + <span class="hl-code">java</span> (interpreter) + <span class="hl-code">jar</span> + <span class="hl-code">javadoc</span> + tools.</p>
        <p>Platform-specific: Windows, Linux, Solaris; Mac has its own.</p>
        <p><span class="hl-term">Use</span>: development environment for Java apps &amp; applets.</p>
      

        <p><span class="hl-keyword">JRE</span> = Java Runtime Environment â€” physically exists.</p>
        <p>Provides: core classes, libraries, <span class="hl-term">JVM</span>, and components to <span class="hl-keyword">run</span> Java programs.</p>
        <p>Part of JDK but can be downloaded separately.</p>
        <p><span class="hl-code">Cannot</span> be used for development â€” only for <span class="hl-keyword">execution</span>.</p>
      

        <p><span class="hl-keyword">JVM</span> = Java Virtual Machine â€” executes <span class="hl-code">bytecode</span>.</p>
        <p>Resides on your machine; bytecode is JVM's machine language.</p>
        <p>Compiler generates bytecode for JVM, not machine code.</p>
        <p><span class="hl-term">Key</span>: JVM makes Java <span class="hl-keyword">platform-independent</span>.</p>
      

        <p><span class="hl-keyword">Bytecode</span> = intermediate machine-independent code.</p>
        <p>Set of instructions for <span class="hl-term">JVM</span> â€” similar to assembler.</p>
        <p>Processed by JVM (not the processor) â†’ <span class="hl-code">.class</span> file runs on any platform.</p>
        <p>Flow: <span class="hl-term">.java</span> â†’ compiler â†’ <span class="hl-keyword">.class</span> (bytecode) â†’ JVM â†’ machine code.</p>
      

        <p><span class="hl-keyword">Procedural</span>: divided into <span class="hl-term">functions</span>, top-down, no access specifiers, less secure.</p>
        <p><span class="hl-keyword">OOP</span>: divided into <span class="hl-term">objects</span>, bottom-up, access specifiers, data hiding, inheritance.</p>
        <p>OOP supports <span class="hl-code">overloading</span> &amp; code reusability; procedural does not.</p>
        <p>Procedural: C, Pascal, BASIC &nbsp;|&nbsp; OOP: <span class="hl-keyword">Java</span>, C++, Python, C#.</p>
      

        <p>Write code in <span class="hl-code">.java</span> file â†’ compile with <span class="hl-term">javac</span> â†’ generates <span class="hl-code">.class</span>.</p>
        <p>Run with <span class="hl-keyword">java</span> command.</p>
        <p><span class="hl-term">Example</span>: <span class="hl-code">javac MyFirstJavaProgram.java</span> â†’ <span class="hl-code">java MyFirstJavaProgram</span>.</p>
        <p>Output: <span class="hl-keyword">Hello World</span>.</p>
      

        <p><span class="hl-keyword">Case-sensitive</span> â€” <span class="hl-code">Hello</span> â‰  <span class="hl-code">hello</span>.</p>
        <p><span class="hl-term">Class names</span>: UpperCamelCase (e.g. <span class="hl-code">MyFirstJavaClass</span>).</p>
        <p><span class="hl-term">Method names</span>: lowerCamelCase (e.g. <span class="hl-code">myMethodName()</span>).</p>
        <p>File name must match <span class="hl-keyword">class name</span> exactly + <span class="hl-code">.java</span>.</p>
        <p><span class="hl-term">main()</span> is mandatory: <span class="hl-code">public static void main(String[] args)</span>.</p>
      

        <p>Set <span class="hl-keyword">PATH</span> variable to run <span class="hl-code">javac</span>, <span class="hl-code">java</span> from any directory.</p>
        <p>Windows: Properties â†’ Advanced â†’ Environment Variables â†’ add <span class="hl-term">Path</span>.</p>
        <p>Value: <span class="hl-code">C:\\Program Files\\Java\\jdk1.7.0_21\\bin</span> (adjust to your JDK).</p>
        <p>Without PATH: must type full path each time.</p>
      

        <p>Complete <span class="hl-keyword">Hello World</span> program â€” the entry point for every Java developer.</p>
        <p>Class name: <span class="hl-term">MyFirstJavaProgram</span> &bull; file: <span class="hl-code">MyFirstJavaProgram.java</span>.</p>
        <p><span class="hl-keyword">main()</span> method is public, static, void, with <span class="hl-code">String[] args</span>.</p>
        <p><span class="hl-term">System.out.println()</span> prints to console.</p>
      

        <p><span class="hl-keyword">Encapsulation</span> â€” bundling data and methods, hiding internals.</p>
        <p><span class="hl-term">Inheritance</span> â€” subclass inherits from superclass (extends).</p>
        <p><span class="hl-keyword">Polymorphism</span> â€” same method name, different behaviours (overloading/overriding).</p>
        <p><span class="hl-term">Abstraction</span> â€” hiding implementation details (abstract classes & interfaces).</p>
      

        <p>Errors and exceptions are handled using <span class="hl-keyword">try-catch-finally</span> blocks.</p>
        <p><span class="hl-term">Checked</span> exceptions (compile-time) vs <span class="hl-term">Unchecked</span> (runtime).</p>
        <p>Use <span class="hl-code">throws</span> to declare exceptions, <span class="hl-code">throw</span> to raise them.</p>
        <p>Custom exceptions extend <span class="hl-keyword">Exception</span> class.</p>
      

        <p><span class="hl-keyword">List</span> â€” ordered, duplicates allowed (ArrayList, LinkedList).</p>
        <p><span class="hl-term">Set</span> â€” no duplicates (HashSet, TreeSet).</p>
        <p><span class="hl-keyword">Map</span> â€” key-value pairs (HashMap, TreeMap).</p>
        <p><span class="hl-term">Queue</span> â€” FIFO (PriorityQueue, ArrayDeque).</p>
      

        <p><span class="hl-keyword">Thread</span> â€” lightweight process, concurrent execution.</p>
        <p>Create by extending <span class="hl-term">Thread</span> or implementing <span class="hl-term">Runnable</span>.</p>
        <p>Synchronization â€” <span class="hl-code">synchronized</span> keyword for thread-safe access.</p>
        <p>Methods: <span class="hl-keyword">start()</span>, <span class="hl-code">run()</span>, <span class="hl-code">sleep()</span>, <span class="hl-code">join()</span>, <span class="hl-code">wait()</span>/<span class="hl-code">notify()</span>.</p>
      

        <p><span class="hl-keyword">InputStream</span>/<span class="hl-term">OutputStream</span> â€” byte streams.</p>
        <p><span class="hl-keyword">Reader</span>/<span class="hl-term">Writer</span> â€” character streams.</p>
        <p>Common classes: <span class="hl-code">FileInputStream</span>, <span class="hl-code">FileOutputStream</span>, <span class="hl-code">BufferedReader</span>, <span class="hl-code">PrintWriter</span>.</p>
        <p>Serialization â€” <span class="hl-term">Serializable</span> interface to persist objects.</p>
`;

  return (
    <div className="unit-html-content prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
