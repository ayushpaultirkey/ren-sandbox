A note for future me, when you started working on a project again.

# TODO
All the systems are working correctly, but the `graphset` should be executed in isolation from the editor. As the editor's data might conflict with the `graphset`'s data, the graph set should have a separate execution environment.

For that, remove the execution button from the `node` and use the execution button that is present in the side menu of the editor. When that button is clicked, export the current `graphset` and then execute that `graphset` in isolation. The editor `node` should not be execute.

For executing the `graphset`, each of them will have their own entry `graph`, that is stored into it. If its not defined then get the top `graph` of the `graphset` and execute it.

Also remove the `signature` property from the `IObject` as it will be no longer needed.