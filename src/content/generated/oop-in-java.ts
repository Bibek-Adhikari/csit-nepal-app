// AI-readable (MDN-style) content generated from OOP in Java PDFs.
// Schema: { title, overview, sections: [{ slug, heading, html }] }
export const subjectContent = {
  "/subjects/semester-2/oop-in-java": {
    title: "Object Oriented Programming using Java",
    overview:
      "Object-oriented programming (OOP) using Java introduces core concepts like classes, objects, inheritance, polymorphism, exception handling and file handling.",
    sections: [
      {
        slug: "introduction",
        heading: "Introduction to Java & OOP",
        html: `
<h2>1.1 The Java Platform</h2>
<p>The Java platform is a software bundle that lets you develop and run programs written in the Java language. The <strong>Java Development Kit (JDK)</strong> is required to write and run Java programs; the <strong>Java Runtime Environment (JRE)</strong> is included in the JDK and provides the <strong>Java Virtual Machine (JVM)</strong> plus the standard libraries needed to run Java applications.</p>

<h3>Compilation &amp; Execution</h3>
<ol>
  <li>Write source code: <code>HelloWorld.java</code>. The class name <strong>must</strong> match the file name (<code>public class HelloWorld</code>).</li>
  <li>Compile: <code>javac HelloWorld.java</code> &rarr; produces <code>HelloWorld.class</code> (bytecode).</li>
  <li>Run: <code>java HelloWorld</code> &rarr; the JVM loads, verifies and executes the bytecode.</li>
</ol>
        <div class="callout">
          <p><strong>JVM</strong> executes bytecode; <strong>JRE</strong> = JVM + libraries; <strong>JDK</strong> = JRE + development tools (javac, java, javadoc …).</p>
        </div>

<h3>Big-O Complexity (Math)</h3>
<p>Array access is $O(1)$, linear search is $O(n)$, binary search is $O(\\log n)$, and bubble sort is $O(n^2)$. The expected time for quicksort is $$T(n) = 2T(n/2) + cn$$ which solves to $O(n \\log n)$.</p>
`,
      },
      {
        slug: "classes-objects",
        heading: "Classes & Objects",
        html: `
<h2>2.1 Class</h2>
<p>A <strong>class</strong> is a template that defines the state (data/attributes/fields) and behaviour (methods) of an object. It is a <em>logical</em> concept.</p>

<pre><code class="language-java">class Student {
    String name;
    int rollNo;

    void display() {
        System.out.println(name + " " + rollNo);
    }
}
</code></pre>

<h2>2.2 Object</h2>
<p>An <strong>object</strong> is an <em>instance</em> of a class &mdash; a real, physical entity occupying memory. You create one with the <code>new</code> keyword.</p>

<pre><code class="language-java">Student s1 = new Student(); // s1 is an object of type Student
</code></pre>

<h3>Constructors</h3>
<ul>
  <li><strong>Default constructor:</strong> no-arg, provided by the compiler if none is written.</li>
  <li><strong>Parameterized constructor:</strong> accepts arguments; used to set initial state.</li>
  <li>Constructor overloading is allowed; the one matching the <code>new</code> call is used.</li>
</ul>

<pre><code class="language-java">class Student {
    Student() { }              // no-arg
    Student(String n, int r) {
        name = n; rollNo = r;
    }
}
</code></pre>`,
      },
      {
        slug: "inheritance",
        heading: "Inheritance & Polymorphism",
        html: `
<h2>3.1 Inheritance</h2>
<p>One class (<strong>subclass</strong>) acquires the fields and methods of another (<strong>superclass</strong>) via the <code>extends</code> keyword. It promotes <strong>code reuse</strong> and supports the <strong>is-a</strong> relationship.</p>

<pre><code class="language-java">class Vehicle {
    void move() { System.out.println("moving"); }
}
class Bike extends Vehicle {
    void speedUp() { System.out.println("bike speeds up"); }
}
</code></pre>

<h3>Types of inheritance</h3>
<table>
  <thead><tr><th>Type</th><th>Syntax</th><th>Java supports?</th></tr></thead>
  <tbody>
    <tr><td>Single</td><td>A &rarr; B</td><td>Yes</td></tr>
    <tr><td>Multilevel</td><td>A &rarr; B &rarr; C</td><td>Yes</td></tr>
    <tr><td>Hierarchical</td><td>A &rarr; B, A &rarr; C</td><td>Yes</td></tr>
    <tr><td>Multiple</td><td>A &rarr; B, C &rarr; B</td><td>via interfaces only</td></tr>
    <tr><td>Hybrid</td><td>mix</td><td>via interfaces only</td></tr>
  </tbody>
</table>

<h2>3.2 Polymorphism</h2>
<p><strong>Polymorphism</strong> ("many forms") lets one interface represent different underlying forms. <strong>Method overriding</strong> is runtime polymorphism; <strong>overloading</strong> is compile-time.</p>

<pre><code class="language-java">@Override
void move() { super.move(); System.out.println("bike moving"); }
</code></pre>
<div class="callout">
  <p><code>@Override</code> is optional but highly recommended &mdash; it makes mistakes a compile-time error.</p>
</div>`,
      },
      {
        slug: "exceptions",
        heading: "Exception Handling",
        html: `
<h2>4.1 Hierarchy</h2>
<pre><code>java.lang.Throwable
├── Error        // serious JVM problems (don't catch)
└── Exception
    ├── RuntimeException   // unchecked (e.g. NullPointerException)
    └── (checked)          // must be declared/handled
</code></pre>

<h2>4.2 try / catch / finally</h2>
<pre><code class="language-java">try {
    int x = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("div by zero");
} finally {
    System.out.println("always runs");
}
</code></pre>

<h2>4.3 throws / throw</h2>
<p>Use <code>throw</code> to create an exception; <code>throws</code> in a method signature declares that the method may throw checked exceptions.</p>

<pre><code class="language-java">void read() throws IOException { ... }
if (age < 0) throw new IllegalArgumentException("age < 0");
</code></pre>`,
      },
      {
        slug: "collections",
        heading: "Collections & Generics",
        html: `
<h2>5.1 The Collections Framework</h2>
<table>
  <thead><tr><th>Interface</th><th>Ordered</th><th>Duplicates</th><th>Thread-safe</th><th>Implementations</th></tr></thead>
  <tbody>
    <tr><td>List</td><td>Yes</td><td>Yes</td><td>No</td><td>ArrayList, LinkedList, Vector</td></tr>
    <tr><td>Set</td><td>No</td><td>No</td><td>No</td><td>HashSet, LinkedHashSet, TreeSet</td></tr>
    <tr><td>Queue</td><td>Yes</td><td>Yes</td><td>Partial</td><td>PriorityQueue, LinkedList</td></tr>
    <tr><td>Map</td><td>Key-only</td><td>Keys unique</td><td>No</td><td>HashMap, TreeMap, Hashtable</td></tr>
  </tbody>
</table>

<h2>5.2 Generics (type safety)</h2>
<pre><code class="language-java">List&lt;String&gt; names = new ArrayList&lt;&gt;();
names.add("BCA");          // OK
// names.add(10);          // compile error – type safety
</code></pre>
<div class="callout">
  <p>Generics catch type mismatches at compile time. Use <code>&lt;&gt;</code> (diamond) for the implementation side.</p>
</div>`,
      },
    ],
  },
  // Add more subjects here later, e.g. "ux-ui-design", "principles-of-management"
};
