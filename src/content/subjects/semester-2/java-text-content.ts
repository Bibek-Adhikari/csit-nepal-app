export const javaTextContent: Record<string, string> = {
  "intro-java-oop": `
<div class="text-content-card">
<h3>Introduction <span class="tc-badge">1/21</span></h3>
<p><strong>Java</strong> is a high-level, robust, object-oriented, secure programming language developed by <strong>Sun Microsystems</strong> (1995).</p>
<p>It is <strong>platform-independent</strong> &mdash; compiled to <code>bytecode</code> run on <strong>JVM</strong>.</p>
<p>Syntax similar to C/C++ but <strong>no pointers</strong>; not pure OOP due to primitive types.</p>
<p><strong>Platform</strong> = runtime environment (JRE) + API.</p>
</div>

<div class="text-content-card">
<h3>Highlights <span class="tc-badge">2/21</span></h3>
<p>Developed by <strong>James Gosling</strong> (Sun &rarr; Oracle).</p>
<p>Combines <strong>C</strong> format + <strong>C++</strong> OOP features.</p>
<p><strong>WORA</strong> (Write Once, Run Anywhere) &mdash; no recompilation across platforms.</p>
<p><code>JVM</code> executes bytecode; JVM itself is <strong>platform-specific</strong> (C/C++/ASM).</p>
</div>

<div class="text-content-card">
<h3>Creation &amp; History <span class="tc-badge">3/21</span></h3>
<p>Created by <strong>Gosling, Naughton, Sheridan</strong> at Sun in <strong>1991</strong> (18 months).</p>
<p>Originally called <code>Oak</code> &rarr; renamed <strong>Java</strong> in 1995 (trademark conflict).</p>
<p>Designed for <strong>interactive TV</strong> but found success on the <strong>internet</strong>.</p>
<p>Goal: <strong>"Simple, Robust, Portable, Secure, High Performance, Multithreaded"</strong>.</p>
</div>

<div class="text-content-card">
<h3>Version History <span class="tc-badge">4/21</span></h3>
<p><strong>JDK 1.0</strong> (1996) &rarr; <strong>J2SE 5.0</strong> (2004) &rarr; <strong>Java SE 8</strong> (2014) &rarr; <strong>Java SE 17</strong> (2021).</p>
<p>Major releases: <code>Java 11</code> (LTS), <code>Java 17</code> (LTS).</p>
<p>Current stable: <strong>Java SE 18</strong> (March 2022).</p>
<p>Evolution: <strong>JDK &rarr; J2SE &rarr; Java SE</strong>.</p>
</div>

<div class="text-content-card">
<h3>Java &amp; the Internet <span class="tc-badge">5/21</span></h3>
<p>First Java app: <strong>HotJava</strong> browser; applets run in browsers.</p>
<p>Used for <strong>JSP</strong> (dynamic web pages), <strong>Applets</strong>, <strong>J2EE</strong> (enterprise), <strong>JavaBeans</strong> (reusable components).</p>
<p>Widely used in <strong>mobile</strong> (games, apps) and Android development.</p>
<p><strong>3 billion</strong> devices run Java (Sun).</p>
</div>

<div class="text-content-card">
<h3>Types of Java Applications <span class="tc-badge">6/21</span></h3>
<p><strong>Web</strong> &mdash; server-side (Servlet, JSP, Struts, JSF).</p>
<p><strong>Standalone</strong> &mdash; desktop (AWT, Swing) e.g. media player, antivirus.</p>
<p><strong>Enterprise</strong> &mdash; distributed, high-security, load-balancing (EJB).</p>
<p><strong>Mobile</strong> &mdash; Java ME, Android (Google).</p>
</div>

<div class="text-content-card">
<h3>Features of Java <span class="tc-badge">7/21</span></h3>
<p><strong>Object-Oriented</strong> &mdash; simple object model.</p>
<p><strong>Platform Independent</strong> &mdash; bytecode runs anywhere.</p>
<p><strong>Secure</strong> &mdash; virus/malware protection.</p>
<p><strong>Robust</strong> &mdash; early error detection.</p>
<p><strong>Multi-threaded</strong> &mdash; concurrent tasks.</p>
<p><strong>Distributed</strong> &mdash; TCP/IP protocol support.</p>
</div>

<div class="text-content-card">
<h3>JDK &mdash; Java Dev Kit <span class="tc-badge">8/21</span></h3>
<p><strong>JDK</strong> = Java Development Kit &mdash; physically exists.</p>
<p>Includes: <strong>JRE</strong> + <code>javac</code> (compiler) + <code>java</code> (interpreter) + <code>jar</code> + <code>javadoc</code> + tools.</p>
<p>Platform-specific: Windows, Linux, Solaris; Mac has its own.</p>
<p><strong>Use</strong>: development environment for Java apps &amp; applets.</p>
</div>

<div class="text-content-card">
<h3>JRE &mdash; Runtime Env <span class="tc-badge">9/21</span></h3>
<p><strong>JRE</strong> = Java Runtime Environment &mdash; physically exists.</p>
<p>Provides: core classes, libraries, <strong>JVM</strong>, and components to <strong>run</strong> Java programs.</p>
<p>Part of JDK but can be downloaded separately.</p>
<p><code>Cannot</code> be used for development &mdash; only for <strong>execution</strong>.</p>
</div>

<div class="text-content-card">
<h3>JVM &mdash; Virtual Machine <span class="tc-badge">10/21</span></h3>
<p><strong>JVM</strong> = Java Virtual Machine &mdash; executes <code>bytecode</code>.</p>
<p>Resides on your machine; bytecode is JVM's machine language.</p>
<p>Compiler generates bytecode for JVM, not machine code.</p>
<p><strong>Key</strong>: JVM makes Java <strong>platform-independent</strong>.</p>
</div>

<div class="text-content-card">
<h3>Bytecode &amp; Mechanism <span class="tc-badge">11/21</span></h3>
<p><strong>Bytecode</strong> = intermediate machine-independent code.</p>
<p>Set of instructions for <strong>JVM</strong> &mdash; similar to assembler.</p>
<p>Processed by JVM (not the processor) &rarr; <code>.class</code> file runs on any platform.</p>
<p>Flow: <strong>.java</strong> &rarr; compiler &rarr; <strong>.class</strong> (bytecode) &rarr; JVM &rarr; machine code.</p>
</div>

<div class="text-content-card">
<h3>Procedural vs OOP <span class="tc-badge">12/21</span></h3>
<p><strong>Procedural</strong>: divided into <strong>functions</strong>, top-down, no access specifiers, less secure.</p>
<p><strong>OOP</strong>: divided into <strong>objects</strong>, bottom-up, access specifiers, data hiding, inheritance.</p>
<p>OOP supports <code>overloading</code> &amp; code reusability; procedural does not.</p>
<p>Procedural: C, Pascal, BASIC &nbsp;|&nbsp; OOP: <strong>Java</strong>, C++, Python, C#.</p>
</div>

<div class="text-content-card">
<h3>Compiling &amp; Running <span class="tc-badge">13/21</span></h3>
<p>Write code in <code>.java</code> file &rarr; compile with <strong>javac</strong> &rarr; generates <code>.class</code>.</p>
<p>Run with <strong>java</strong> command.</p>
<p><strong>Example</strong>: <code>javac MyFirstJavaProgram.java</code> &rarr; <code>java MyFirstJavaProgram</code>.</p>
<p>Output: <strong>Hello World</strong>.</p>
</div>

<div class="text-content-card">
<h3>Naming Conventions <span class="tc-badge">14/21</span></h3>
<p><strong>Case-sensitive</strong> &mdash; <code>Hello</code> ≠ <code>hello</code>.</p>
<p><strong>Class names</strong>: UpperCamelCase (e.g. <code>MyFirstJavaClass</code>).</p>
<p><strong>Method names</strong>: lowerCamelCase (e.g. <code>myMethodName()</code>).</p>
<p>File name must match <strong>class name</strong> exactly + <code>.java</code>.</p>
<p><strong>main()</strong> is mandatory: <code>public static void main(String[] args)</code>.</p>
</div>

<div class="text-content-card">
<h3>Setting up Environment <span class="tc-badge">15/21</span></h3>
<p>Set <strong>PATH</strong> variable to run <code>javac</code>, <code>java</code> from any directory.</p>
<p>Windows: Properties &rarr; Advanced &rarr; Environment Variables &rarr; add <strong>Path</strong>.</p>
<p>Value: <code>C:\Program Files\Java\jdk1.7.0_21\bin</code> (adjust to your JDK).</p>
<p>Without PATH: must type full path each time.</p>
</div>

<div class="text-content-card">
<h3>Code Example <span class="tc-badge">16/21</span></h3>
<p>Complete <strong>Hello World</strong> program &mdash; the entry point for every Java developer.</p>
<p>Class name: <strong>MyFirstJavaProgram</strong> &bull; file: <code>MyFirstJavaProgram.java</code>.</p>
<p><strong>main()</strong> method is public, static, void, with <code>String[] args</code>.</p>
<p><strong>System.out.println()</strong> prints to console.</p>
<pre><code class="language-java">
public class MyFirstJavaProgram {
    /* This is my first java program.
     * This will print 'Hello World' as the output
     */
    public static void main(String[] args) {
        System.out.println("Hello World"); // prints Hello World
    }
}
</code></pre>
</div>

<div class="text-content-card">
<h3>OOP Concepts <span class="tc-badge">17/21</span></h3>
<p><strong>Encapsulation</strong> &mdash; bundling data and methods, hiding internals.</p>
<p><strong>Inheritance</strong> &mdash; subclass inherits from superclass (extends).</p>
<p><strong>Polymorphism</strong> &mdash; same method name, different behaviours (overloading/overriding).</p>
<p><strong>Abstraction</strong> &mdash; hiding implementation details (abstract classes &amp; interfaces).</p>
</div>

<div class="text-content-card">
<h3>Exception Handling</h3>
<p>Errors and exceptions are handled using <strong>try-catch-finally</strong> blocks.</p>
<p><strong>Checked</strong> exceptions (compile-time) vs <strong>Unchecked</strong> (runtime).</p>
<p>Use <code>throws</code> to declare exceptions, <code>throw</code> to raise them.</p>
<p>Custom exceptions extend <strong>Exception</strong> class.</p>
</div>

<div class="text-content-card">
<h3>Collections Framework <span class="tc-badge">19/21</span></h3>
<p><strong>List</strong> &mdash; ordered, duplicates allowed (ArrayList, LinkedList).</p>
<p><strong>Set</strong> &mdash; no duplicates (HashSet, TreeSet).</p>
<p><strong>Map</strong> &mdash; key-value pairs (HashMap, TreeMap).</p>
<p><strong>Queue</strong> &mdash; FIFO (PriorityQueue, ArrayDeque).</p>
</div>

<div class="text-content-card">
<h3>Multithreading</h3>
<p><strong>Thread</strong> &mdash; lightweight process, concurrent execution.</p>
<p>Create by extending <strong>Thread</strong> or implementing <strong>Runnable</strong>.</p>
<p>Synchronization &mdash; <code>synchronized</code> keyword for thread-safe access.</p>
<p>Methods: <strong>start()</strong>, <code>run()</code>, <code>sleep()</code>, <code>join()</code>, <code>wait()</code>/<code>notify()</code>.</p>
</div>

<div class="text-content-card">
<h3>I/O Streams <span class="tc-badge">21/21</span></h3>
<p><strong>InputStream</strong>/<strong>OutputStream</strong> &mdash; byte streams.</p>
<p><strong>Reader</strong>/<strong>Writer</strong> &mdash; character streams.</p>
<p>Common classes: <code>FileInputStream</code>, <code>FileOutputStream</code>, <code>BufferedReader</code>, <code>PrintWriter</code>.</p>
<p>Serialization &mdash; <strong>Serializable</strong> interface to persist objects.</p>
</div>
`,

  "basic-java-programming": `
<h2>Basic Java Programming</h2>

<h3>Data Types</h3>
<p>Java has two categories of data types:</p>

<h4>Primitive Data Types</h4>
<table>
  <tr><th>Type</th><th>Size</th><th>Description</th></tr>
  <tr><td>byte</td><td>8-bit</td><td>Integer values (-128 to 127)</td></tr>
  <tr><td>short</td><td>16-bit</td><td>Integer values (-32,768 to 32,767)</td></tr>
  <tr><td>int</td><td>32-bit</td><td>Integer values (-2^31 to 2^31-1)</td></tr>
  <tr><td>long</td><td>64-bit</td><td>Integer values (-2^63 to 2^63-1)</td></tr>
  <tr><td>float</td><td>32-bit</td><td>Floating-point numbers (single precision)</td></tr>
  <tr><td>double</td><td>64-bit</td><td>Floating-point numbers (double precision)</td></tr>
  <tr><td>char</td><td>16-bit</td><td>Single Unicode character</td></tr>
  <tr><td>boolean</td><td>1-bit</td><td>true or false</td></tr>
</table>

<h4>Reference Data Types</h4>
<p>String, Array, class, interface, etc.</p>

<h3>Variables</h3>
<pre><code class="language-java">
// Variable declaration
int age;
double salary;
String name;

// Variable initialization
age = 20;
double salary = 25000.50;
</code></pre>

<h3>Operators</h3>
<ul>
  <li><strong>Arithmetic:</strong> +, -, *, /, %, ++, --</li>
  <li><strong>Relational:</strong> ==, !=, >, <, >=, <=</li>
  <li><strong>Logical:</strong> &&, ||, !</li>
  <li><strong>Assignment:</strong> =, +=, -=, *=, /=, %=</li>
  <li><strong>Bitwise:</strong> &, |, ^, ~, <<, >>, >>></li>
</ul>

<h3>Control Structures</h3>

<h4>Conditional Statements</h4>
<pre><code class="language-java">
// if-else
if (age >= 18) {
    System.out.println("Adult");
} else if (age >= 13) {
    System.out.println("Teenager");
} else {
    System.out.println("Child");
}

// switch
switch (day) {
    case 1: System.out.println("Monday"); break;
    case 2: System.out.println("Tuesday"); break;
    // ...
    default: System.out.println("Invalid day");
}
</code></pre>

<h4>Loops</h4>
<pre><code class="language-java">
// for loop
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// while loop
int i = 0;
while (i < 10) {
    System.out.println(i);
    i++;
}

// do-while loop
int i = 0;
do {
    System.out.println(i);
    i++;
} while (i < 10);
</code></pre>

<h3>Arrays</h3>
<pre><code class="language-java">
// Declaration
int[] numbers;
String[] names;

// Initialization
int[] numbers = new int[5];
int[] numbers = {1, 2, 3, 4, 5};

// Accessing elements
System.out.println(numbers[0]); // First element
</code></pre>

<h3>Input/Output</h3>
<pre><code class="language-java">
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);
System.out.print("Enter your name: ");
String name = scanner.nextLine();
System.out.print("Enter your age: ");
int age = scanner.nextInt();
scanner.close();
</code></pre>
`,

  "classes-objects": `
<h2>Classes and Objects in Java</h2>

<h3>Classes</h3>
<p>
A class is a blueprint or template for creating objects. It defines the data (attributes) 
and code (methods) that an object of that class will have.
</p>

<pre><code class="language-java">
public class Student {
    // Data members (fields)
    private String name;
    private int rollNumber;
    private String address;
    
    // Constructor
    public Student(String name, int rollNumber, String address) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.address = address;
    }
    
    // Methods
    public void displayInfo() {
        System.out.println("Name: " + name);
        System.out.println("Roll: " + rollNumber);
        System.out.println("Address: " + address);
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
</code></pre>

<h3>Objects</h3>
<p>
An object is an instance of a class. Objects are created using the 'new' keyword.
</p>

<pre><code class="language-java">
// Creating objects
Student student1 = new Student("John Doe", 101, "Kathmandu");
Student student2 = new Student("Jane Smith", 102, "Pokhara");

// Using object methods
student1.displayInfo();
student2.displayInfo();
</code></pre>

<h3>Constructors</h3>
<p>
Constructors are special methods used to initialize objects. They have the same name 
as the class and no return type.</p>

<pre><code class="language-java">
public class Rectangle {
    private double length;
    private double width;
    
    // Default constructor
    public Rectangle() {
        length = 0;
        width = 0;
    }
    
    // Parameterized constructor
    public Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }
    
    // Copy constructor
    public Rectangle(Rectangle rect) {
        this.length = rect.length;
        this.width = rect.width;
    }
}
</code></pre>

<h3>Static Members</h3>
<p>
Static members belong to the class rather than instances. They can be accessed 
without creating an object.</p>

<pre><code class="language-java">
public class Counter {
    private static int count = 0;
    private int instanceVar;
    
    public Counter() {
        count++;
        instanceVar = count;
    }
    
    public static int getCount() {
        return count;
    }
    
    public static void resetCount() {
        count = 0;
    }
}
</code></pre>

<h3>Access Modifiers</h3>
<ul>
  <li><strong>private:</strong> Accessible only within the same class</li>
  <li><strong>default:</strong> Accessible within the same package</li>
  <li><strong>protected:</strong> Accessible within package and subclasses</li>
  <li><strong>public:</strong> Accessible everywhere</li>
</ul>

<h3>Packages</h3>
<p>
Packages organize classes and provide a namespace. They also control access 
through access modifiers.</p>

<pre><code class="language-java">
package com.bcanepal.student;

public class Student {
    // class body
}
</code></pre>

<h3>Nested Classes</h3>
<p>
Classes defined within another class. Types include: member classes, 
local classes, anonymous classes, and nested classes.</p>

<h3>Garbage Collection</h3>
<p>
Java automatically manages memory through garbage collection. Objects that are no 
longer referenced become eligible for garbage collection. The finalize() method can 
be used for cleanup before an object is garbage collected.</p>
`,

  "inheritance-polymorphism": `
<h2>Inheritance and Polymorphism</h2>

<h3>Inheritance</h3>
<p>
Inheritance is a mechanism that allows a new class (subclass/child class) to inherit 
properties and methods from an existing class (superclass/parent class).
</p>

<pre><code class="language-java">
// Parent class
class Vehicle {
    protected String brand;
    protected int year;
    
    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }
    
    public void start() {
        System.out.println("Vehicle is starting");
    }
    
    public void displayInfo() {
        System.out.println("Brand: " + brand + ", Year: " + year);
    }
}

// Child class
class Car extends Vehicle {
    private int numberOfDoors;
    
    public Car(String brand, int year, int numberOfDoors) {
        super(brand, year);
        this.numberOfDoors = numberOfDoors;
    }
    
    @Override
    public void start() {
        System.out.println("Car is starting with ignition");
    }
    
    public void honk() {
        System.out.println("Beep! Beep!");
    }
}
</code></pre>

<h3>Types of Inheritance</h3>
<ul>
  <li><strong>Single:</strong> One parent &rarr; One child</li>
  <li><strong>Multiple:</strong> Not supported in Java (handled via interfaces)</li>
  <li><strong>Multilevel:</strong> Parent &rarr; Child &rarr; Grandchild</li>
  <li><strong>Hierarchical:</strong> One parent &rarr; Multiple children</li>
  <li><strong>Hybrid:</strong> Combination of multiple types</li>
</ul>

<h3>Method Overriding</h3>
<p>
When a child class provides a specific implementation of a method that is already 
defined in its parent class. Rules:</p>
<ul>
  <li>Method signature must be the same</li>
  <li>Return type must be the same or a subtype (covariant returns)</li>
  <li>Access modifier cannot be more restrictive</li>
  <li>Cannot throw broader exceptions</li>
  <li>Cannot be static, final, or private</li>
  <li>Can use @Override annotation</li>
</ul>

<h3>Method Overloading</h3>
<p>
Multiple methods with the same name but different parameters. It occurs at compile time.</p>

<pre><code class="language-java">
class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    public double add(double a, double b) {
        return a + b;
    }
    
    public int add(int a, int b, int c) {
        return a + b + c;
    }
}
</code></pre>

<h3>Polymorphism</h3>
<p>
Polymorphism means "many forms". It allows objects of different types to be treated 
as instances of the same type through a common interface.</p>

<h4>Runtime Polymorphism (Method Overriding)</h4>
<pre><code class="language-java">
class Animal {
    public void sound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    @Override
    public void sound() {
        System.out.println("Dog barks");
    }
}

class Cat extends Animal {
    @Override
    public void sound() {
        System.out.println("Cat meows");
    }
}

// Usage
Animal animal1 = new Dog(); // Upcasting
Animal animal2 = new Cat();
animal1.sound(); // "Dog barks"
animal2.sound(); // "Cat meows"
</code></pre>

<h3>Abstract Classes</h3>
<p>
Abstract classes cannot be instantiated and may contain abstract methods (methods 
without body). They provide a common base for subclasses.</p>

<pre><code class="language-java">
abstract class Shape {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    // Concrete method
    public void displayColor() {
        System.out.println("Color: " + color);
    }
    
    // Abstract method (must be implemented by subclasses)
    public abstract double calculateArea();
    public abstract double calculatePerimeter();
}

class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double calculatePerimeter() {
        return 2 * Math.PI * radius;
    }
}
</code></pre>

<h3>Interfaces</h3>
<p>
Interfaces define a contract that implementing classes must follow. From Java 8, 
interfaces can have default and static methods.</p>

<pre><code class="language-java">
interface Drawable {
    void draw();
    double getArea();
    
    default void showInfo() {
        System.out.println("Drawing a shape");
    }
    
    static void utilityMethod() {
        System.out.println("Utility method");
    }
}

class Rectangle implements Drawable {
    private double width, height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a rectangle");
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
}
</code></pre>

<h3>Dynamic Method Dispatch</h3>
<p>
Runtime method resolution in Java. When an overridden method is called through a 
reference variable, Java determines at runtime which method to call based on 
the actual object type.</p>
`,

  "exception-handling-multithreading": `
<h2>Exception Handling and Multithreading</h2>

<h3>Exception Handling</h3>
<p>
Exception handling handles runtime errors to maintain normal application flow. 
It prevents program crashes and provides meaningful error messages.
</p>

<h4>Exception Hierarchy</h4>
<p>
Throwable (root) &rarr; Exception (recoverable) / Error (not recoverable)<br>
Exception &rarr; RuntimeException (unchecked) / IOException (checked)
</p>

<h4>Try-Catch-Finally</h4>
<pre><code class="language-java">
try {
    int result = 10 / 0;
    System.out.println(result);
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero: " + e.getMessage());
} finally {
    System.out.println("This always executes");
}
</code></pre>

<h4>Try-With-Resources</h4>
<pre><code class="language-java">
try (FileInputStream fis = new FileInputStream("file.txt");
     BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    // Resources are automatically closed
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
</code></pre>

<h4>Throw vs Throws</h4>
<pre><code class="language-java">
public void checkAge(int age) throws InvalidAgeException {
    if (age < 18) {
        throw new InvalidAgeException("Age must be 18 or above");
    }
    System.out.println("Valid age");
}

// Custom Exception
class InvalidAgeException extends Exception {
    public InvalidAgeException(String message) {
        super(message);
    }
}
</code></pre>

<h4>Common Exceptions</h4>
<ul>
  <li>ArithmeticException: Division by zero</li>
  <li>NullPointerException: Accessing null object</li>
  <li>NumberFormatException: Invalid number format</li>
  <li>ArrayIndexOutOfBoundsException: Invalid array index</li>
  <li>FileNotFoundException: File not found</li>
  <li>IOException: General I/O errors</li>
</ul>

<h3>Multithreading</h3>
<p>
Multithreading allows concurrent execution of parts of a program for maximum 
CPU utilization. Each thread is a lightweight sub-process.
</p>

<h4>Creating Threads</h4>

<h5>Extending Thread Class</h5>
<pre><code class="language-java">
class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + ": " + i);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}

// Usage
MyThread t1 = new MyThread();
MyThread t2 = new MyThread();
t1.start();
t2.start();
</code></pre>

<h5>Implementing Runnable Interface</h5>
<pre><code class="language-java">
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Thread is running via Runnable");
    }
}

// Usage
Thread thread = new Thread(new MyRunnable());
thread.start();
</code></pre>

<h4>Synchronization</h4>
<p>
Synchronization prevents thread interference and ensures thread safety when 
multiple threads access shared resources.</p>

<pre><code class="language-java">
class Counter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
    
    public synchronized int getCount() {
        return count;
    }
    
    // Synchronized block
    public void incrementWithBlock() {
        synchronized(this) {
            count++;
        }
    }
}
</code></pre>

<h4>Inter-thread Communication</h4>
<p>
Threads can communicate using wait(), notify(), and notifyAll() methods.</p>

<pre><code class="language-java">
class ProducerConsumer {
    private int data;
    private boolean hasData = false;
    
    public synchronized void produce(int value) {
        while (hasData) {
            try { wait(); } catch (InterruptedException e) {}
        }
        data = value;
        hasData = true;
        System.out.println("Produced: " + value);
        notify();
    }
    
    public synchronized int consume() {
        while (!hasData) {
            try { wait(); } catch (InterruptedException e) {}
        }
        hasData = false;
        notify();
        return data;
    }
}
</code></pre>

<h4>Concurrency Utilities (java.util.concurrent)</h4>
<ul>
  <li>ExecutorService: Thread pool management</li>
  <li>Future: Handle results asynchronously</li>
  <li>ConcurrentHashMap: Thread-safe map implementation</li>
  <li>CountDownLatch: Synchronization aid</li>
  <li>CyclicBarrier: Synchronization point for threads</li>
  <li>Semaphore: Limit concurrent access</li>
  <li>ThreadLocal: Per-thread variable</li>
</ul>
`,

  "file-handling-java": `
<h2>File Handling in Java</h2>

<h3>File I/O Overview</h3>
<p>
Java provides comprehensive support for file handling through the java.io and 
java.nio.file packages. File I/O operations include reading, writing, creating, 
and deleting files.
</p>

<h3>Byte Streams</h3>
<p>
Byte streams handle binary data (8-bit bytes). They inherit from InputStream and OutputStream.</p>

<h4>FileInputStream</h4>
<pre><code class="language-java">
import java.io.FileInputStream;
import java.io.IOException;

try (FileInputStream fis = new FileInputStream("file.txt")) {
    int byteData;
    while ((byteData = fis.read()) != -1) {
        System.out.print((char) byteData);
    }
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
</code></pre>

<h4>FileOutputStream</h4>
<pre><code class="language-java">
import java.io.FileOutputStream;
import java.io.IOException;

try (FileOutputStream fos = new FileOutputStream("output.txt")) {
    String data = "Hello, File Handling!";
    fos.write(data.getBytes());
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
</code></pre>

<h3>Character Streams</h3>
<p>
Character streams handle character data (16-bit Unicode). They inherit from Reader and Writer.</p>

<h4>FileReader and FileWriter</h4>
<pre><code class="language-java">
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

// Reading
try (FileReader fr = new FileReader("input.txt")) {
    int charData;
    while ((charData = fr.read()) != -1) {
        System.out.print((char) charData);
    }
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}

// Writing
try (FileWriter fw = new FileWriter("output.txt")) {
    fw.write("Hello, Character Streams!");
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
</code></pre>

<h3>Buffered Streams</h3>
<p>
Buffered streams improve performance by reducing the number of I/O operations. 
They use an internal buffer.</p>

<pre><code class="language-java">
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

// Buffered reading
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}

// Buffered writing
try (BufferedWriter bw = new BufferedWriter(new FileWriter("output.txt"))) {
    bw.write("First line");
    bw.newLine();
    bw.write("Second line");
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
</code></pre>

<h3>Serialization</h3>
<p>
Serialization is the process of converting an object's state into a byte stream. 
The Serializable interface must be implemented.</p>

<pre><code class="language-java">
import java.io.Serializable;
import java.io.ObjectOutputStream;
import java.io.ObjectInputStream;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.IOException;

class Student implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private int rollNumber;
    private transient String password; // Not serialized
    
    // constructors, getters, setters...
}

// Serialization
try (ObjectOutputStream oos = new ObjectOutputStream(
        new FileOutputStream("student.ser"))) {
    Student student = new Student("John", 101);
    oos.writeObject(student);
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}

// Deserialization
try (ObjectInputStream ois = new ObjectInputStream(
        new FileInputStream("student.ser"))) {
    Student student = (Student) ois.readObject();
    System.out.println("Name: " + student.getName());
} catch (IOException | ClassNotFoundException e) {
    System.out.println("Error: " + e.getMessage());
}
</code></pre>

<h3>NIO (New I/O) - java.nio.file</h3>
<p>
NIO.2 provides modern file handling capabilities with Path and Files classes.</p>

<pre><code class="language-java">
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.io.IOException;
import java.util.List;

// Path operations
Path path = Paths.get("file.txt");
System.out.println("File name: " + path.getFileName());
System.out.println("Absolute path: " + path.toAbsolutePath());

// Read all lines
try {
    List<String> lines = Files.readAllLines(path);
    lines.forEach(System.out::println);
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}

// Write to file
try {
    Files.writeString(path, "Hello, NIO.2!");
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}

// Copy file
try {
    Files.copy(Paths.get("source.txt"), Paths.get("dest.txt"),
               StandardCopyOption.REPLACE_EXISTING);
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}

// Delete file
try {
    Files.deleteIfExists(Paths.get("file.txt"));
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
</code></pre>

<h3>File Class</h3>
<p>
The File class represents file and directory pathnames. It provides methods to 
create, delete, and manage files and directories.</p>

<pre><code class="language-java">
import java.io.File;

File file = new File("path/to/file.txt");
System.out.println("Exists: " + file.exists());
System.out.println("Can read: " + file.canRead());
System.out.println("Can write: " + file.canWrite());
System.out.println("File size: " + file.length() + " bytes");

// Create directory
File dir = new File("newdir");
if (!dir.exists()) {
    dir.mkdir();
}
</code></pre>
`,

  "collections-generics": `
<h2>Collections and Generics</h2>

<h3>The Collections Framework</h3>
<p>
The Java Collections Framework is a single unified architecture for representing 
and manipulating groups of objects. It includes interfaces, implementations, and algorithms.
</p>

<h4>Core Interfaces</h4>
<table>
  <tr><th>Interface</th><th>Description</th></tr>
  <tr><td>Collection</td><td>Root interface for all collections</td></tr>
  <tr><td>List</td><td>Ordered collection, allows duplicates</td></tr>
  <tr><td>Set</td><td>Unordered collection, no duplicates</td></tr>
  <tr><td>Queue</td><td>FIFO order for processing elements</td></tr>
  <tr><td>Deque</td><td>Double-ended queue</td></tr>
  <tr><td>Map</td><td>Key-value pairs (not extends Collection)</td></tr>
</table>

<h3>List Interface</h3>

<h4>ArrayList</h4>
<pre><code class="language-java">
List&lt;String&gt; list = new ArrayList&lt;&gt;();
list.add("One");
list.add("Two");
list.add(1, "Three"); // Insert at index
list.get(0); // "One"
list.set(0, "Updated"); // Replace at index
list.remove("Two"); // Remove element
list.size();
list.forEach(System.out::println);
</code></pre>

<h4>LinkedList</h4>
<pre><code class="language-java">
List&lt;Integer&gt; list = new LinkedList&lt;&gt;();
list.add(10);
list.add(20);
// LinkedList also supports Deque operations
((LinkedList&lt;Integer&gt;)list).addFirst(5);
((LinkedList&lt;Integer&gt;)list).addLast(100);
((LinkedList&lt;Integer&gt;)list).removeFirst();
</code></pre>

<h3>Set Interface</h3>

<h4>HashSet</h4>
<pre><code class="language-java">
Set&lt;String&gt; set = new HashSet&lt;&gt;();
set.add("Apple");
set.add("Banana");
set.add("Apple"); // Duplicates ignored
// Order is not guaranteed
</code></pre>

<h4>TreeSet</h4>
<pre><code class="language-java">
Set&lt;Integer&gt; set = new TreeSet&lt;&gt;();
set.add(10);
set.add(5);
set.add(20);
// Sorted in natural order: 5, 10, 20
</code></pre>

<h4>LinkedHashSet</h4>
<pre><code class="language-java">
Set&lt;String&gt; set = new LinkedHashSet&lt;&gt;();
// Maintains insertion order
</code></pre>

<h3>Queue Interface</h3>

<h4>PriorityQueue</h4>
<pre><code class="language-java">
Queue&lt;Integer&gt; queue = new PriorityQueue&lt;&gt;();
queue.offer(10);
queue.offer(5);
queue.offer(20);
// Elements returned in sorted order: 5, 10, 20
Integer head = queue.poll(); // Returns and removes head
</code></pre>

<h4>ArrayDeque</h4>
<pre><code class="language-java">
Deque&lt;String&gt; deque = new ArrayDeque&lt;&gt;();
deque.offerFirst("First");
deque.offerLast("Last");
String first = deque.peekFirst();
String last = deque.peekLast();
</code></pre>

<h3>Map Interface</h3>

<h4>HashMap</h4>
<pre><code class="language-java">
Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
map.put("One", 1);
map.put("Two", 2);
map.get("One"); // 1
map.getOrDefault("Three", 0); // 0
map.putIfAbsent("One", 100); // Not replaced if exists
map.keySet(); // All keys
map.values(); // All values
map.entrySet(); // Key-value pairs
map.forEach((k, v) -&gt; System.out.println(k + "=" + v));
</code></pre>

<h4>TreeMap</h4>
<pre><code class="language-java">
Map&lt;String, Integer&gt; map = new TreeMap&lt;&gt;();
// Keys are sorted in natural order
</code></pre>

<h3>Iterators</h3>
<pre><code class="language-java">
List&lt;String&gt; list = new ArrayList&lt;&gt;(Arrays.asList("A", "B", "C"));

// Iterator
Iterator&lt;String&gt; it = list.iterator();
while (it.hasNext()) {
    String item = it.next();
    if ("B".equals(item)) {
        it.remove(); // Safe removal during iteration
    }
}

// ListIterator (bidirectional)
ListIterator&lt;String&gt; listIt = list.listIterator();
listIt.next();
listIt.previous();
listIt.add("New"); // Add at current position
listIt.set("Updated"); // Replace current element
</code></pre>

<h3>Collections Utility Class</h3>
<pre><code class="language-java">
List&lt;Integer&gt; list = new ArrayList&lt;&gt;(Arrays.asList(5, 2, 8, 1, 9));

Collections.sort(list);
Collections.reverse(list);
Collections.shuffle(list);
int min = Collections.min(list);
int max = Collections.max(list);
int freq = Collections.frequency(list, 5);
</code></pre>

<h3>Generics</h3>
<p>
Generics add type safety and enable type erasure for backward compatibility.</p>

<pre><code class="language-java">
// Generic class
class Box&lt;T&gt; {
    private T value;
    
    public void set(T value) {
        this.value = value;
    }
    
    public T get() {
        return value;
    }
}

// Usage
Box&lt;String&gt; stringBox = new Box&lt;&gt;();
stringBox.set("Hello");
String value = stringBox.get(); // Type-safe, no cast needed

// Generic methods
public static &lt;T&gt; void swap(T[] array, int i, int j) {
    T temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

// Bounded types
class NumberBox&lt;T extends Number&gt; {
    private T number;
    
    public T getNumber() {
        return number;
    }
    
    public double getValue() {
        return number.doubleValue();
    }
}

// Wildcards
public static void printList(List&lt;?&gt; list) {
    for (Object item : list) {
        System.out.println(item);
    }
}

// Bounded wildcards
public static void printNumbers(List&lt;? extends Number&gt; numbers) {
    for (Number num : numbers) {
        System.out.println(num);
    }
}
</code></pre>

<h3>Comparable and Comparator</h3>
<pre><code class="language-java">
class Student implements Comparable&lt;Student&gt; {
    private String name;
    private int marks;
    
    @Override
    public int compareTo(Student other) {
        return Integer.compare(this.marks, other.marks);
    }
}

// Using Comparator
Collections.sort(students, Comparator.comparing(s -&gt; s.getName()));
Collections.sort(students, Comparator.comparing(Student::getMarks).reversed());
students.sort(Comparator.comparing(Student::getMarks)
                        .thenComparing(Student::getName));
</code></pre>

<h3>Streams API</h3>
<pre><code class="language-java">
List&lt;String&gt; names = Arrays.asList("Alice", "Bob", "Charlie", "David");

names.stream()
     .filter(name -&gt; name.length() &gt; 4)
     .map(String::toUpperCase)
     .sorted()
     .collect(Collectors.toList());

// Parallel streams
names.parallelStream()
     .filter(name -&gt; name.startsWith("A"))
     .forEach(System.out::println);
</code></pre>
`,

  "advanced-oop-concepts": `
<h2>Advanced OOP Concepts in Java</h2>

<h3>Lambda Expressions (Java 8)</h3>
<p>
Lambda expressions provide a concise way to implement functional interfaces 
(single abstract method interfaces). They enable functional programming in Java.
</p>

<pre><code class="language-java">
// Before Java 8
List&lt;String&gt; names = Arrays.asList("Alice", "Bob", "Charlie");
names.sort(new Comparator&lt;String&gt;() {
    public int compare(String a, String b) {
        return a.compareTo(b);
    }
});

// With lambda
names.sort((a, b) -&gt; a.compareTo(b));

// More examples
Runnable r1 = () -&gt; System.out.println("Hello, Lambda!");
names.forEach(name -&gt; System.out.println(name));
names.forEach(System.out::println); // Method reference

// Functional interface
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
}

Calculator add = (a, b) -&gt; a + b;
Calculator multiply = (a, b) -&gt; a * b;
System.out.println(add.calculate(5, 3)); // 8
</code></pre>

<h3>Functional Interfaces</h3>
<p>
Functional interfaces have exactly one abstract method. Common ones in java.util.function:</p>
<ul>
  <li>Predicate&lt;T&gt; - boolean test(T t)</li>
  <li>Function&lt;T, R&gt; - R apply(T t)</li>
  <li>Consumer&lt;T&gt; - void accept(T t)</li>
  <li>Supplier&lt;T&gt; - T get()</li>
</ul>

<pre><code class="language-java">
Predicate&lt;Integer&gt; isEven = num -&gt; num % 2 == 0;
Function&lt;String, Integer&gt; parseInt = str -&gt; Integer.parseInt(str);
Consumer&lt;String&gt; print = str -&gt; System.out.println(str);
Supplier&lt;String&gt; getMessage = () -&gt; "Hello, World!";
</code></pre>

<h3>Streams API (Java 8)</h3>
<p>
Streams provide a functional approach to processing collections of objects. They support 
filtering, mapping, and reducing operations.</p>

<pre><code class="language-java">
List&lt;Person&gt; people = getPeople();

// Filter, sort, collect
List&lt;String&gt; result = people.stream()
    .filter(p -&gt; p.getAge() &gt;= 18)
    .sorted(Comparator.comparing(Person::getName))
    .map(Person::getName)
    .collect(Collectors.toList());

// Collectors
Map&lt;Boolean, List&lt;Person&gt;&gt; adults = people.stream()
    .collect(Collectors.partitioningBy(p -&gt; p.getAge() &gt;= 18));

Map&lt;String, List&lt;Person&gt;&gt; byCity = people.stream()
    .collect(Collectors.groupingBy(Person::getCity));

// Numeric streams
int[] nums = {1, 2, 3, 4, 5};
IntStream.of(nums)
    .filter(n -&gt; n % 2 == 0)
    .sum();

// Parallel streams
people.parallelStream()
    .filter(p -&gt; p.getAge() &gt; 30)
    .collect(Collectors.toList());
</code></pre>

<h3>Method References</h3>
<p>
Method references provide a way to call existing methods using shorthand syntax.</p>

<pre><code class="language-java">
// Static method reference
Function&lt;String, Integer&gt; parseInt = Integer::parseInt;

// Instance method reference
String str = "Hello";
Supplier&lt;Integer&gt; length = str::length;

// Constructor reference
Function&lt;String, Person&gt; personFactory = Person::new;

// Class instance method reference
Function&lt;Person, String&gt; getName = Person::getName;
</code></pre>

<h3>Annotations (Java 5)</h3>
<p>
Annotations are metadata that provide data about a program but are not actual program 
logic. They can be processed at compile time or runtime.</p>

<pre><code class="language-java">
// Built-in annotations
@Override
@Override
public String toString() {
    return "Student{name='" + name + "'}";
}

@Deprecated
public void oldMethod() {
    // Old implementation
}

@SuppressWarnings("unchecked")
List list = new ArrayList(); // Suppress unchecked warnings

// Custom annotation
@interface MyAnnotation {
    String value();
    int priority() default 1;
    String[] tags() default {};
}

@MyAnnotation(value = "test", priority = 10, tags = {"java", "oop"})
public class MyClass {
    // class body
}

// Meta-annotations
@Retention(RetentionPolicy.RUNTIME) // Available at runtime
@Target({ElementType.METHOD, ElementType.TYPE}) // Can be used on methods and types
@interface MyAnnotation {
    String value();
}
</code></pre>

<h3>Reflection API</h3>
<p>
Reflection allows programs to examine and dynamically call classes, interfaces, 
fields, and methods at runtime.</p>

<pre><code class="language-java">
// Getting class information
Class&lt;?&gt; clazz = Class.forName("com.example.Person");
String className = clazz.getName();
String packageName = clazz.getPackage().getName();

// Getting fields
Field[] fields = clazz.getDeclaredFields();
Field nameField = clazz.getDeclaredField("name");
nameField.setAccessible(true);
Object value = nameField.get(personObject);

// Getting and invoking methods
Method[] methods = clazz.getDeclaredMethods();
Method setName = clazz.getMethod("setName", String.class);
setName.invoke(personObject, "Alice");

// Creating instances
Constructor&lt;?&gt; constructor = clazz.getDeclaredConstructor();
Object instance = constructor.newInstance();
</code></pre>

<h3>Design Patterns</h3>

<h4>Singleton Pattern</h4>
<pre><code class="language-java">
public class Singleton {
    private static Singleton instance;
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
    
    // Thread-safe version
    public static synchronized Singleton getInstanceThreadSafe() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
    
    // Double-checked locking
    private static volatile Singleton instance2;
    
    public static Singleton getInstanceDoubleChecked() {
        if (instance2 == null) {
            synchronized (Singleton.class) {
                if (instance2 == null) {
                    instance2 = new Singleton();
                }
            }
        }
        return instance2;
    }
}
</code></pre>

<h4>Factory Pattern</h4>
<pre><code class="language-java">
interface Shape {
    void draw();
}

class Circle implements Shape {
    public void draw() { System.out.println("Circle"); }
}

class Rectangle implements Shape {
    public void draw() { System.out.println("Rectangle"); }
}

class ShapeFactory {
    public Shape getShape(String type) {
        if ("circle".equalsIgnoreCase(type)) {
            return new Circle();
        } else if ("rectangle".equalsIgnoreCase(type)) {
            return new Rectangle();
        }
        return null;
    }
}
</code></pre>

<h4>Observer Pattern</h4>
<pre><code class="language-java">
interface Observer {
    void update(String message);
}

class NewsAgency {
    private List&lt;Observer&gt; observers = new ArrayList&lt;&gt;();
    private String news;
    
    public void addObserver(Observer observer) {
        observers.add(observer);
    }
    
    public void notifyObservers() {
        for (Observer o : observers) {
            o.update(news);
        }
    }
    
    public void setNews(String news) {
        this.news = news;
        notifyObservers();
    }
}
</code></pre>

<h4>Builder Pattern</h3>
<pre><code class="language-java">
class Computer {
    private String CPU;
    private int RAM;
    private int storage;
    
    private Computer(Builder builder) {
        this.CPU = builder.CPU;
        this.RAM = builder.RAM;
        this.storage = builder.storage;
    }
    
    public static class Builder {
        private String CPU;
        private int RAM;
        private int storage;
        
        public Builder setCPU(String CPU) {
            this.CPU = CPU;
            return this;
        }
        
        public Builder setRAM(int RAM) {
            this.RAM = RAM;
            return this;
        }
        
        public Builder setStorage(int storage) {
            this.storage = storage;
            return this;
        }
        
        public Computer build() {
            return new Computer(this);
        }
    }
}

// Usage
Computer computer = new Computer.Builder()
    .setCPU("Intel i7")
    .setRAM(16)
    .setStorage(512)
    .build();
</code></pre>
`
};
