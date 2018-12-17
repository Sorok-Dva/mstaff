# Guidelines

Theses guidelines must be followed in the source code.

Please do not hesitate to challenge them, if needed or relevant. 

## General

If you think your code is overcomplicated, please discuss it.

Follow rules enforced by the linter.

No code duplication is allowed. (no excuse is accepted)

Always ask and verify that the functionality doesn't already exists 
in the code base (migrations, helpers...).

Discuss with the guardians to make sure that design of the 
feature that you are developing is relevant.

Make the features as small as possible to deploy them gradually.

## Tests:

Every functionality of the app should be tested. 

Every bug encountered should be replicated using an automated test. 

Use functions called tester to factorize tests and better readability.

## Code

### General
All optionals arguments should be provided in a final last argument.

All the time references should be either:
 * time points WITH timestamps
 * time intervals
=> Yes, this excludes "raw dates".

Wrap HTTP responses in an object with the name of the object. 

### Practices

#### Error Handling
* Use only the built-in Error object

*Many throws errors as a string or as some custom type – this complicates the error handling logic and the interoperability between modules. Whether you reject a promise, throw exception or emit error – using only the built-in Error object will increases uniformity and prevents loss of information.*

**Code Example – doing it right**
```javascript
//throwing an Error from typical function, whether sync or async
 if(!thingToAdd)
 throw new Error("How can I add new thing when no value provided?");
 
//'throwing' an Error from EventEmitter
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
 
//'throwing' an Error from a Promise
 return new promise(function (resolve, reject) {
	return Table.getThing(thingToAdd.id).then((existingThing) =>{
		 if(existingThing != null)
			 reject(new Error("Why fooling us and trying to add an existing thing?"));
```
**Code example – Anti Pattern**
```javascript
//throwing a String lacks any stack trace information and other important properties
if(!thingToAdd)
    throw ("How can I add new thing when no value provided?");

//'throwing' an Error from EventEmitter
const myEmitter = new MyEmitter();
myEmitter.emit('error', 'whoops');
```
* Distinguish operational vs programmer errors

*Operational errors (e.g. API received an invalid input) refer to known cases where the error impact is fully understood and can be handled thoughtfully. On the other hand, programmer error (e.g. trying to read undefined variable) refers to unknown code failures that dictate to gracefully restart the application*
```javascript
//marking an error object as operational 
let myError = new Error("How can I add new thing when no value provided?");
myError.isOperational = true;
```

## Migrations

Never change migrations already pushed on the remote of `master` or `release`.

No imports to code in migrations.

No down migration is required.

When squashing migrations, we always write in the commit message `squash migrations`.

## Branches

Push as soon as possible to `develop`.

When a feature is complete, also create pull request to `release` branch.

`release` should be always behind `master`.
If a PR  is validated on `release`, merge it into master. 
